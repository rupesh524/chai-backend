// import mongoose from 'mongoose';
// import { DB_NAME } from '../constants';    // IMPORT DBNAME

//require ('dotenv').config({path : './env'})
import dotenv from 'dotenv'

import DB_CONNECT from './db/index.js';

 dotenv.config({
     path : './env'
})
 import express from 'express'
 const app = express();

DB_CONNECT()
.then(()=>{
      app.listen(process.env.PORT || 8000, ()=>{
          console.log(`server is running on port : ${process.env.PORT}`);
      })
})
.catch ((err)=>{
    console.log("MONGO_DB CONNECTION FAILED", err);
})




// approch 1 isme sara index file me ho jata hsai toh index file bhot pollute ho jati hai 
/*

// async await intazar karta hai jis bhi chij pe await lagate hai uska intazar karta hai await 
(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

        app.on("error", (error)=>{     // connect express is express is not connect successfully then this will be executed
            console.log("Error :", error);
             throw error;
        })
        // if express sucessfully connected  
        app.listen(process.env.PORT ,()=>{
             console.log(`app is listening  on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error :",error)    // we can write console.log also here 
    }
}

)() // iify 
 */