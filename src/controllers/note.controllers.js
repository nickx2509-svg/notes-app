import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Note } from "../models/note.models.js";
import mongoose from "mongoose";


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

const getNote = asyncHandler(async(req,res) => {
// req.user is coming from middlewares jwt
  const userId = req.user._id

  // latest first 
  const notes = await Note.find({ owner: userId }).sort({ createdAt: -1 })

  return res.status(200).json(
    new ApiResponse(
      200,
      notes,
      "Get All notes"
    )
  )
})

const singleNote = asyncHandler(async(req,res) => {

// 1. Client sends GET /notes/:noteId with accessToken
// 2. verifyJWT middleware runs
// 3. req.user is attached (logged-in user)
// 4. Extract noteId from URL params
// 5. Find note in database by noteId
// 6. If note not found → 404
// 7. Check: note.owner === req.user._id
// 8. If not owner → 403 Forbidden
// 9. If owner → return note

const { noteId } = req.params;
const userId = req.user._id;

// validate Notes
if(!mongoose.Types.ObjectId.isValid(noteId)){
  throw new ApiError(401,"Invalid note id")
}
// find note

const note = await Note.findById( noteId )

if(!note){
  throw new ApiError(401,"No note found")
}

// ownership check
if(note.owner.toString() !== userId.toString()){
  throw new ApiError(401,"you are not allow to get notes")
}
// send response
return res.status(200).json(
  new ApiResponse(
    200,
    note,
    "Note fetched successfully"
  )
)
})

const updateNote = asyncHandler(async(req,res) => {
// 1. Client sends PUT /notes/:noteId with accessToken
// 2. verifyJWT middleware runs
// 3. req.user is attached
// 4. Extract noteId from URL
// 5. Validate noteId (ObjectId check)
// 6. Read title/content from req.body
// 7. If nothing to update → error
// 8. Find note by noteId
// 9. If note not found → 404
// 10. Check ownership (note.owner === req.user._id)
// 11. If not owner → 403 Forbidden
// 12. Update note in DB
// 13. Return updated note

const { noteId } =  req.params;
const { title,content } =  req.body
const userId = req.user._id

// validate note

if(!mongoose.Types.ObjectId.isValid(noteId)){
  throw new ApiError(400,"invalide note id")
}

// check at least one field is provided

if(!title && !content){
  throw new ApiError(400,"nothing to update");
}
// find Note
const note = await Note.findById(noteId)

if(!note){
  throw new ApiError(400,"Note not found")
}

// ownership check
if(note.owner.toString() !== userId.toString()){
  throw new ApiError(403, "You are not allow to change the note")
}

// update filed
if(title) note.title = title.trim()
if(content) note.content = content.trim()
await note.save()

// send response
return res.status(200).json(
  new ApiResponse(
    200,
    note,
    "Note updated successfully "
  )
)

})

const deleteNote = asyncHandler(async(req,res) => {
  const { noteId } = req.params;
  const userId = req.body;

  // validate note
  if(!mongoose.Types.ObjectId.isValid(noteId)){
    throw new ApiError(400,"Invalid note id")
  }

  // find Note
  const note = await Note.findById(noteId)

  if(!note){
    throw new ApiError(400,"note not found")
  }
  // ownership check

  if(note.owner.toString() !== userId.toString()){
    throw new ApiError(403,"You are not allow")
  }
  // delete note
  await Note.deleteOne();
  //send response

  return res.status(200).json(
    200,
    note,
    "Note deleted successfully"
  )
})

export {
  createNote,
  getNote,
  singleNote,
  updateNote,
  deleteNote
}