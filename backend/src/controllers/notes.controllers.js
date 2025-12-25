import z from "zod";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { Note } from "../models/notes.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const notesSchema = z.object({
  title: z.string().trim().min(1, "Title is Required"),
  content: z.string().trim().min(1, "Content is Required"),
});

export const createNotes = asyncHandler(async (req, res) => {
  const notesData = notesSchema.safeParse(req.body);

if (!notesData.success) {
  throw new ApiError(
    400,
    "Invalid note format",
    notesData.error.issues,
    )
}

  const { title, content } = notesData.data;
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized Access");
  }
  const note = await Note.create({
    title: title.trim(),
    content: content.trim(),
    user: userId,
  });

  if (!note) {
    throw new ApiError(500, "Note could not be created");
  }
  const cleanNote = await Note.findById(note._id).select("-__v").lean();
  return res
    .status(200)
    .json(new ApiResponse(200, cleanNote, "Note Created Successfully"));
});
export const getAllNotes = asyncHandler(async (req, res) => {
  if(!req.user._id){
    throw new ApiError(404,"Unauthorized Access")
  }
  const userId=req.user._id;
  const allNotes=await Note.find({user:userId}).select("-__v").sort({ createdAt: -1 }).lean();
  if(allNotes.length===0){
     return res.status(200).json(
      new ApiResponse(200, [], "No notes found")
    );
  }
 return res.status(200).json(
  new ApiResponse(200, { notes: allNotes }, "Notes Fetched Successfully")
);

});

export const updateNotes = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized Access");
  }
  const userId = req.user._id;
  const { noteId } = req.params;
  if (!noteId) {
    throw new ApiError(400, "Missing Note Id in request");
  }
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "Invalid Note Id");
  }
  const updateNotesSchema = notesSchema.partial();

  const updateData = updateNotesSchema.safeParse(req.body);

  if (!updateData.success) {
    throw new ApiError(
      400,
      "Invalid Update note format",
      updateData.error.issues
    );
  }
  const { title, content } = updateData.data;
  const existingNote = await Note.findById({ _id: noteId, user: userId });
  if (!existingNote) {
    throw new ApiError(
      404,
      "Note not found or you are not allowed to update it"
    );
  }
  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    {
      title: title,
      content: content,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .select("-__v")
    .lean();
  if (!updatedNote) {
    throw new ApiError(500, "Note update failed");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedNote, "Note Updated Successfully"));
});

export const deleteNotes = asyncHandler(async (req, res) => {
   if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized Access");
  }
  const userId = req.user._id;
  const { noteId } = req.params;
  if (!noteId) {
    throw new ApiError(400, "Missing Note Id in request");
  }
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "Invalid Note Id");
  }

  const deletedNote=await Note.deleteOne({_id:noteId, user:userId})
 
   if (deletedNote.deletedCount === 0) {
    throw new ApiError(404, "Note not found or not owned by user");
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Note Deleted Successfully")
  )
});
export const getNote = asyncHandler(async (req, res) => {
  if(!req.user._id){
    throw new ApiError(401,"Unauthorized Acess")
  }
  const userId = req.user._id;
  const { noteId } = req.params;
  if (!noteId) {
    throw new ApiError(400, "Missing Note Id in request");
  }
  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "Invalid Note Id");
  }
  const note=await Note.findOne(
    {
      _id:noteId,
      user:userId
    }
  ).select("-__v")
  .lean()
  if(!note){
    throw new ApiError(404,"Note not found or you don't have access to it")
  }
  return res
  .status(200)
  .json(new ApiResponse(200,note,"Note fetched successfully"))
});
