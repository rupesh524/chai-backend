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
import {uploadoncloudnary}   from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async(req, res) => {

//......       // user details from frontend.......... 

        const {username,email,fullname,password} = req.body
        console.log("email:",email);


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
 const existeduser =    User.findOne({
            $or :[{email},{username}]
})

if(existeduser){
       throw new ApiError(409,"user with email or usernmame exist ") 
}

//4... check for images and avtars
          const avatarLocalPath =    req.files?.avatar[0]?.path;
          const coverimagelocalpath   = req.files?.coverImage[0]?.path;


          if(!avatarLocalPath){
              throw new ApiError(404,"Avatar file is required")
          }
                  // agar image ya video jayada mb ya gb ki hui toh await jaruri hai 
            const avatar  =   await uploadoncloudnary(avatarLocalPath);
            const coverImage = await uploadoncloudnary(coverimagelocalpath);

            if(!avatar){
                throw new ApiError(404,"Avatar file is required")
            }

})
    

//5.  create user object
 
const user = User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url|| "",
        email,
        password,
        username : username.toLowerCase(),
})

    const createduser =   User.findById(user._id).select(

        "-password -refreshTokens "
      )

      if(!createduser){
           throw new ApiError(500,"something went wrong while registering a user");
      }


      // status is 201 alag se bhi de sakte hai ya sab new wale me bhi likh sakte hai 
       return res.status(201).json(
           new ApiResponse(200,createduser,"user registered successfully"); 
       )


export { registerUser };