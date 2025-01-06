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


export { registerUser };

