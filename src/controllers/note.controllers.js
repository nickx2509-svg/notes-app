import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Note } from "../models/note.models.js";


const createNote = asyncHandler(async(req,res) => {
  // get data from req.body
  // validate input
  // get loggod in user
  // create Note save to database
  // send response 

  const {title,content} = req.body

  if(!title || !content){
    throw new ApiError(404,"All fileds are required")
  }

  const userId = req.user._id

  const note = await Note.create({
    title,
    content,
    owner:userId,
  });

  return res
  .status(201).json(
    new ApiResponse(
      200,
      note,
      "Note Created Successfully"
    )
  )



})

export {createNote}