import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const ConnectDB = async () =>{

  try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/ ${DB_NAME}`)
      
      console.log("MongoDB connected host: " , connectionInstance.connection.host)
  } catch (error) {
    console.log("Something went wrong while connection with mongoDB");
    process.exit(1)
    
  }
}

export {ConnectDB}