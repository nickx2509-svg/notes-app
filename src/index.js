import dotenv from 'dotenv'
dotenv.config()

import { app } from './app.js'

import { ConnectDB } from './db/index.js';



const port = process.env.PORT || 5000

app.on('error',(err) => {
  console.log("Something went wrong",err);
  process.exit(1)
})

const serverStart = async () => {
  try {
    await ConnectDB()

    app.listen(port,() => {
      console.log(`server is running at port ${port}`)
    })
  } catch (error) {
    console.log("Server failed to start",error);
    process.exit(1)
    
    
  }

}

serverStart()
