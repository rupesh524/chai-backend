import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({                     // cors origin means from where we are getting the data 
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

// json data limit is 16kb 
app.use(express.json({limit:"16kb"}))

// bhot url encoded hoti hai 
app.use(express.urlencoded({extended : true,limit : "16kb"}))

// pdf store imaage 
app.use(express.static("public"))

app.use(cookieParser())


export { app }