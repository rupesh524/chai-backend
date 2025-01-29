// import { asyncHandler} from  "../utils/asyncHandler.js";

// //method run kab ho koi url hit hone par 
// const registerUser = asyncHandler(async (req,res) =>{

//        res.status(200).json({
//         message : "ok"
//        })
// })
// export {
//     registerUser
// }
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User}   from "../models/user.model.js"
import {uploadOnCloudinary}   from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken = async(userId)=>{
            try {
                const user =  await User.findById(userId);  // user ek wo particular user hai 
                                                     // currently jo logged in hau 
                                                     // jiski id unique hi hoti hai 
                const accessToken = user.generateAccessToken();
                const refreshToken = user.refreshAccessToken();

                // refresh token ko database me dalna hai 
                user.refreshTokens = refreshToken;
               await  user.save({validateBeforeSave : false} )  // validatebefore save means field check mat karoempty hai kya 
                 
               return {accessToken,refreshToken}

            } catch (error) {
                throw new ApiError(500,"Something went wrong while generating accesstoken and refreshtoken")

            }
}





const registerUser = asyncHandler(async(req, res) => {

//......       // user details from frontend.......... 
console.log("Files in request:", req.files);

        const {username,email,fullname,password} = req.body
        //console.log("email:",email);
      //  console.log("data from postman is ",req.body);

///......        // validate.......

        // //way 1  har par if laga do -
        // if(fullname === "") {
        //     throw  new ApiError(400,"fullname is required")
        // }
       
        // way -2
        if(
            [fullname,username,email,password].some((field)=>
              field?.trim() === "")
            ){
                throw new ApiError(400,"all fields are required")
            }


//....... 3. check if already exist
     

                      // find one means   jo bhi pehla user hoga us username ya us mail se toh wo sahi ho jayega
 const existeduser =  await  User.findOne({
            $or :[{username},{email}]
})

if(existeduser){
       throw new ApiError(409,"user with email or usernmame exist ") 
}

     //4. check if  avatar image cover image 
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    console.log("Avatar Path:", avatarLocalPath);

    // Check if avatar is provided
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Upload avatar and cover image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    // Check if avatar upload was successful
    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar");
    }
            

//5.  create user object
 
const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url|| "",
        email,
        password,
        username : username.toLowerCase(),
})

    const createduser =  await  User.findById(user._id).select(

        "-password -refreshTokens "
      );

      if(!createduser){
           throw new ApiError(500,"something went wrong while registering a user");
      }

     
       return res.status(201).json(
           new ApiResponse(200,createduser,"user registered successfully") 
       )
    })

  const loginUser = asyncHandler(async (req,res)=>{
          // req bode ->data
          // username or email se validation karao 
          // find the user
          // password check
          // access and refresh token generate 
          // send cookies 
          // send response

          // 1. get data
         const {username,email,password} = req.body;


         //2. validation HERE THIS IS CORRECT LOGIC 
         if(!(username || email)){
              throw new ApiError(400,"username or email is required");
         }
           
         //3. find user
         const user = await User.findOne({
            $or: [{ username }, { email }]
        });
         if(!user){
              throw new ApiError(404,"user does not exist")
         } 
         // 4. paswword validation  written is password correct in user model                                         
         //   // user means particular user ki bat ho rahi hai 
         const isPasswordValid =   await  user.isPasswordCorrect(password)
         
         if(!isPasswordValid){
               throw new ApiError(401,"invalid user credentials")
         }
          // 5. yha tak sahi hai toh access token and refresh token generate kar do uska upar likha hai function 
          // unique id assign hoti hai har entry ko database me 
       const {accessToken,refreshToken} = await  generateAccessTokenAndRefreshToken(user._id)
       
       
       // optional step 
       // logged in user me hame user ko kya kya dena hai wo nahi hai means usse hame passwork dena hi nahi hai 

     const LoggedInUser =  await User.findById(user._id)
     .select("-password -refreshToken")
      
     // cookies  secure beacuse no one can update it on frontend 
     
     // 6-7 sending cookies and response 
     const options = {
           httpOnly : true,
           secure : true
     }
      return res.status(200)   // sending access and refresh token as cokkien
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(                // api response class with status code data in key value user and message
         new ApiResponse(
              200,
              {
                // tokens hame cookkies me bhi bhej diye hai or yha bhi bhej rahe kyoki kabhi kabhi need ho jati hai 
               user :  LoggedInUser ,accessToken, refreshToken
              },
              "User Logged in Sucessfully"
            )
      )

  })




  // logout
   const LogoutUser = asyncHandler(async (req,res)=>{
         await User.findByIdAndUpdate(
            req.user._id,              // find by req.user._id which will be given by our middleware
            {
                 $set :{              // set our new refresh token to undefined 
                     refreshToken : undefined
                 }
            },
            {                 //new true shows the new value of refresh toen which is undefined  
                new : true
            }
        )

        // ab hame cookie bhi clear karna padega 
        const options = {
            httpOnly : true,
            secure : true
      }

      return res.
      status(200) // now clear refreshtoken and access token because the cookie alsao contain it 
      .clearCookie("refreshToken",options)
      .clearCookie("accessToken",options)
      .json( new ApiResponse(200,{},"user logged out "))
   })


   const requestAccessToken = asyncHandler(async(req,res) =>{
          // isse ham refresh token lete hai || koi mobile app se kare toh woh yha aayega 
       const incomingRefreshToken =    req.cookies.refreshToken || req.body.refreshToken;
        if(!incomingRefreshToken){
             throw new ApiError(401,"unauthoried request")
        }

        // jarurat toh nahi hai try catch ki but thik hai dal do try catch me 
        try {
             const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
             // is decoded token means jab ham refreshtken banaya tha toh uske sath ek id bhi dali thi hamne
    
             const user = await User.findById(decodedToken?._id);
    
             if(!user){
                throw new ApiError(401,"invalid refresh token ")
           }
            // ab jo hamare pass HAR USER KE LIYE me hamne jo token save karwaya thA WO ISSE MATCH KART RAHA HAI KYa 
             if (incomingRefreshToken !== user?.refreshToken) {
                   throw new ApiError(401,"Refresh token is expired or used ");
             }
            
             const options  = {
                  httpOnly : true,
                  secure : true
             }
    
             const {accessToken,newrefreshToken} = await generateAccessTokenAndRefreshToken(user._id)
              
             return res
             .status(200)
             // sending tokens to cookiies
             .cookie("accesstoken", accessToken,options)
             .cookie("refreshToken",newrefreshToken,options)
             // sending a json response asc well 
             .json(
                new ApiResponse(
                    200,
                    {accessToken,refreshToken :newrefreshToken},
                    "Access token refreshed"
                )
             )
        } catch (error) {
            throw new ApiError(401,error?.message|| "invalid refresh token")
        }
   })



export { 
    registerUser,
    loginUser,
    LogoutUser,
    requestAccessToken

};

