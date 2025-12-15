import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.models.js'
import jwt from 'jsonwebtoken'

const registerUser = asyncHandler(async(req,res) => {
  let {username,email,password} = req.body
  
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
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax"
};


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
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax"
};

  return res
  
  .status(200)
  .clearCookie("refreshToken",options)
  .json(
    200,
    "User logout successfully",
    null,


  )



})

const refreshAccessToken = asyncHandler(async(req,res) => {
  //  read refreshToken from cookie
  // if refreshToken missing throw error
  // verify refreshToken by JWT
  // Find user in DB
  // match Token with DB
  // generate new AccessToken
  // send response

  const refreshToken = req.cookies?.refreshToken;

  console.log("HEADERS:", req.headers.cookie);
  console.log("COOKIES:", req.cookies)
  console.log("REFRESH SECRET:", process.env.REFRESH_TOKEN_SECRET); console.log("TOKEN:", refreshToken);



  if(!refreshToken){
    throw new ApiError(401,"refresh Token is missing")
  }

  // verify by JWT
  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    
  } catch (error) {
    throw new ApiError(404,"invalid or expire refreshToken")
  }

  // FIND USER IN DB
  const user = await User.findById(decoded._id).select("+refreshToken")

  if(!user){
    throw new ApiError(401,"user not found")
  }

  // compare with DB

  if(user.refreshToken !== refreshToken){
    throw new ApiError(401,"refreshToken doesn't match")
  }

  const newAccessToken = user.generateAccessToken();

  return res.status(200).json(
    new ApiResponse(
      200,
      { accessToken: newAccessToken},
      "AccessToken refresh"
    )
  )
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
}