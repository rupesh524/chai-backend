// import express from "express"
// import cors from "cors"
// import cookieParser from "cookie-parser"
// const app = express()

// app.use(cors({                     // cors origin means from where we are getting the data 
//     origin : process.env.CORS_ORIGIN,
//     credentials : true
// }))

// // json data limit is 16kb 

// app.use(express.json({limit:"16kb"}))

// // bhot url encoded hoti hai 
// app.use(express.urlencoded({extended : true,limit : "16kb"}))

// // pdf store imaage 
// app.use(express.static("public"))

// app.use(cookieParser())




// //router import
// import userRouter from "./routes/user.routes.js"


// // now it will pass throught middleware
// //router declaration
// // control userroute ke pass aa jayuegs
// app.use("/api/v1/users",userRouter);



// // http://:localhost/8000:/api/v1/users/register

// export { app }


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

const app = express();

// Middleware to handle CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));

// Middleware to parse JSON payloads (16kb limit)
app.use(express.json({ limit: "16kb" }));

// Middleware to handle URL encoded data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files (like images, PDFs)
app.use(express.static("public"));

// Middleware to handle cookies cookie pass kar sakte hai 
app.use(cookieParser());

// Mount user routes to API path
app.use("/api/v1/users", userRouter);

// Export the app instance
export { app };
