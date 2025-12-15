import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.models.js'

const registerUser = asyncHandler(async(req,res) => {
  const {username,email,password} = req.body
  
  if(!username || !email || !password){
    throw new ApiError(400,"All fileds are required")
  }

   username = username.trim();
  email = email.trim().toLowerCase();

  const existedUser = await User.findOne({
    $or:[{ username },{ email }]
  })

  if(existedUser){
    throw new ApiError(409,"User already exists. Please login."
)
  }

  const user = await User.create({
    username,
    email,
    password
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  return res.status(201).json(
    new ApiResponse(
      200,
      createdUser,
      "User Created Successfully"
    )
  )

})


const loginUser = asyncHandler(async(req,res) => {
  const {email,password} = req.body
  if(!email || !password) {
    throw new ApiError(400,"All fileds are required")
  }
  const user = await User.findOne({ email }).select("+password")
  if(!user){
    throw new ApiError(404,"User is not found do sign up")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(404,"incorrect Password")
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({validateBeforeSave: false})

  const loggedUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,{
        user:loggedUser,
        accessToken
      } ,"Login successful"
      
    )
  )
  






})

const logoutUser = asyncHandler(async(req,res) => {
  const userId = req.user._id
  
  User.findByIdAndUpdate(
    userId,
    { $unset :{ refreshToken : 1} },
    { new:true }
  )

  const options = {
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie("refreshToken",options)
  .json(
    200,
    "User logout successfully",
    null

  )

  console.log(req.headers);

})

export {
  registerUser,
  loginUser,
  logoutUser
}