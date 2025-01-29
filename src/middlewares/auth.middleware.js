
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt  from "jsonwebtoken"
import { User } from "../models/user.model.js"

// middle ware likh rahe hai ki user login hai ya nahi login hai tioh logout karwana hai toh logout wale function me
//pata toh chale konsa user logoutt karwqana hai  to id ke liye ke uske pass id chali jaye 
// middleware me lagta hai next mera kam ho gay aage jao 
export const verifyJWT = asyncHandler(async (req,res,next)=>{
       
    // cokkies ham req se le rahe hai jisme .accesstoken mil raaha hai agar wo yha se nahi mil raha ho toh 
    //mobile application me kabhi kabnhi login se bhi aa rahi hoti hai cookies to ham wha se le saktehai 
    // wgha Authorisation : Bearer <token> is format me milta hai  usko ham replace kar denge khali se toh
    // hamare pass only token bach jawegac 

  try {
     const token =  req.cookies?.accessToken || req.header
      ("Authorization")?.replace("Bearer ","")
           
      if(!token){
          throw new ApiError(401,"UNauthorised Request")
      }
      
      // if the signature of token matches secret key it will hold decodeddata but no then it will contain error
      const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)  
                                          
       // we have this _id in where we generate access token
       const user = await User.findById(decodedToken._id)
       .select("-password -refreshToken")
       
       if(!user){
           throw new ApiError(401,"Invalid Access Token")
       }

       // agar hamare pass user hai toh request.user me ham hamara user dal rahe hai usse kya hoga ki 
       // user ke pass us user ki id chali jaygi jo ham logout me use kar sakte haoi 
       req.user = user

       // mera kam ho gaya pass to next  
       next()
  
  } catch (error) {
     throw new ApiError(401,error?.message|| "Invalid Acess Token")
  }


})
