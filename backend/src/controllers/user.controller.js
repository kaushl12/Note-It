import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


export const generateRefreshAndAccessTokens = async (userId) => {
  try {
    // Always extract only the ID
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found while generating tokens");
    }

    // Generate tokens from user methods
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    console.error("Token Generation Error:", error);

    throw new ApiError(
      500,
      "Something went wrong while generating Refresh and Access tokens",
      error?.message
    );
  }
};

const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(12)
    .max(50)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),

  password: z
    .string()
    .trim()
    .min(6)
    .max(100)
    .regex(/[0-9]/, "Must contain at least one digit")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(
      /[$&+,:;=?@#|'<>.^*()%!-]/,
      "Must contain at least one special character"
    ),
});
export const register = asyncHandler(async (req, res) => {
  const validatedData = registerSchema.safeParse(req.body);

  if (!validatedData.success) {
    return res.status(400).json({
      message: "Invalid registration data format",
      error: validatedData.error.issues,
    });
  }
  const { email, password } = validatedData.data;

  const existedUser = await User.findOne({
    email,
  });
  if (existedUser) {
    throw new ApiError(409, "User with email already exits");
  }
  const newUser = await User.create({
    email,
    password,
  });
  const createdUser = await User.findById(newUser._id)
    .select("-password -refreshToken")
    .lean();

  if (!createdUser) {
    throw new ApiError(500, [], "Something went wrong while registering user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registration Successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const loginData = registerSchema.safeParse(req.body);
  const isProd = process.env.NODE_ENV === "production";


  if (!loginData.success) {
    throw new ApiError(400, "Invalid login data", loginData.error.issues);
  }

  const { email, password } = loginData.data;

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } =
    await generateRefreshAndAccessTokens(user);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: isProd,                 // 🔴 FIX
    sameSite: isProd ? "none" : "lax", // 🔴 FIX
    maxAge: 3 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User Logged-In Successfully"
      )
    );
});

export const logout =asyncHandler(async(req,res)=>{

  const userId=req.user._id;
  await User.findByIdAndUpdate(userId,{
       $unset:{ refreshToken:1}
  },{
    new:true
  })
  const options={
     httpOnly:true,
     secure:true
  }
  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,{},"User Logged-out")
  )

})


export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch {
    throw new ApiError(401, "Refresh token invalid or expired");
  }

  const user = await User.findById(decoded._id);
  if (!user || incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } =
    await generateRefreshAndAccessTokens(user);

  const cookieOptions = {
    httpOnly: true,
    secure: isProd,                 // 🔴 FIX
    sameSite: isProd ? "none" : "lax", // 🔴 FIX
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { userId: user._id },
        "Access token refreshed successfully"
      )
    );
});

export const getMe=asyncHandler(async(req,res)=>{
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "User fetched Successfully"
    )
  )
})

