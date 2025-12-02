import  jwt  from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  console.log("Hello Going Through middleware");
  
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "").trim();
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  let decodedToken;
  try {
    decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Token is invalid or expired");
  }
  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid Access Token");
  }

  req.user = user;
  next();
});
