import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateRefreshAndAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refereshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Refresh and Access tokens"
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
  const loginData = registerSchema.safeParse(body);
  if (!loginData.success) {
    return res.status(200).json({
      message: "Invalid Login data",
      error: loginData.error.issues,
    });
  }
  const { email, password } = loginData.data;
  const isUserExists = await User.findOne({ email });
  if (!isUserExists || (await isUserExists.isPasswordCorrect(password))) {
    throw new ApiError(401, [], "Inavlid email or password");
  }

  const { accessToken, refereshToken } = await generateRefreshAndAccessTokens(
    isUserExists._id
  );
  const loggedInUser = await User.findById(isUserExists._id).select(
    "-password -refreshToken"
  );

  const options={
    httpOnly:true,
    secure:true
  }
  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refereshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,accessToken,refereshToken
      },
      "User Logged-In Successfully"
    )
  )
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
