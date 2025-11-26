import { asyncHandler } from "../utils/asyncHandlers.js";

export const createNotes=asyncHandler(async(req,res)=>{
    res.send("Hello in creating")
})
export const getAllNotes=asyncHandler(async(req,res)=>{
    res.send("Hello in all")
})

export const updateNotes=asyncHandler(async(req,res)=>{
    res.send("Hello in update")
})

export const deleteNotes=asyncHandler(async(req,res)=>{
    res.send("Hello in dekete")
})
export const getNote=asyncHandler(async(req,res)=>{
    res.send("Hello in notes")
})



