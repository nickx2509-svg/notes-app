import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
    trim:true
  },
  content:{
    type:String,
    required:true,
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    index:true,
  }
},{timestamps:true})


export const Note = mongoose.model("Note",noteSchema)