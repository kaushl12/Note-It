import z from "zod";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { Note } from "../models/notes.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const notesSchema = z.object({
  title: z.string().trim().min(1, "Title is Required"),
  content: z.string().trim().min(1, "Content is Required"),
});

export const createNotes = asyncHandler(async (req, res) => {
  const notesData = notesSchema.safeParse(req.body);
  if (!notesData.success) {
    return res.status(400).json({
      message: "Invalid Format",
      error: notesData.error.issues,
    });
  }

  const {title,content}=notesData.data;
  const userId=req.user?._id;
  if(!userId){
    throw new ApiError(401,"Unauthorized Access")
  }
  const note=await Note.create({
    title:title.trim(),
    content:content,
    user:userId
  })
  if(!note){
    throw new ApiError(500,"Note could not be created")
  }
  return res.status(200).json(
    new ApiResponse(200,note,"Note Created Successfully")
  )
});
export const getAllNotes = asyncHandler(async (req, res) => {
  res.send("Hello in all");
});

export const updateNotes = asyncHandler(async (req, res) => {
  res.send("Hello in update");
});

export const deleteNotes = asyncHandler(async (req, res) => {
  res.send("Hello in dekete");
});
export const getNote = asyncHandler(async (req, res) => {
  res.send("Hello in notes");
});
