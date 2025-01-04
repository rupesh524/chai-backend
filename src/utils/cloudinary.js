import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadoncloudnary = async (localfilepath) =>{
      try {
          //check
          if(!localfilepath) return null;

   //store in variable       // upload on cloudnary
      const response =     cloudinary.uploader.upload(localfilepath,{
            resource_type : "auto"
          })

          // log
          console.log("image uploaded successfully",response.url);
          return response;

          
      } catch (error) {
         fs.unlinkSync(localfilepath);              //file ko unlink kar deta hai agar upload operation fail hua toh 
         return null;
      }
}

export {uploadoncloudnary}