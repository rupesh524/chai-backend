import mongoose  from "mongoose"
import {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema(
    {
      username :{
         type : String,
         required : true,
         unique : true,
         lowercase : true,
         trim : true,
         index : true
      },
      email :{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
     },
     fullname :{
        type : String,
        required : true,
        lowercase : true,
        trim : true
     },
     avatar :{
         type : String, // cloundinary url 
        required : true,
     },
     coverImage : {
         type : String,  // cloudinary url
     },
     watchHistory : [
        {
             type : Schema.Types.ObjectId,
             ref : "Video"
        }
     ],
     password :{
           type : String,     
           required : [true,"password is required"],
     },
     refreshTokens :{
            type : String,
     },
},{
    timestamps : true
})

userSchema.pre("save", async function(next) {            
   // jese hi save ho toh ye kam ho jaye
      
        // agar password modifies ho toh hi ye function execute karna nahi toh mat karna 
        if(!this.isModified("password")) return next();  
      this.password = await bcrypt.hash(this.password,10);
      next();                                      // next kyoki middleware me kam ho jane par next ko
                                                               // passb bhi toh kaarna padega
      
})


userSchema.methods.isPasswordCorrect =  async function(password){
   return await bcrypt.compare(password,this.password)         // this.password database me jo password store hai 
}

    // access 
userSchema.methods.generateAccessToken = function(){
     return jwt.sign({                                    // this wali chij jo hai database se aa rahi hai 
           _id : this._id,
           email : this.email,
           username  : this.username,
           fullName :  this.fullName,
     },
     process.env.ACCESS_TOKEN_SECRET,
     {
      expiresIn : process.env.ACCESS_TOKEN_EXPIRY,
     }
     )
}


userSchema.methods.refreshAccessToken = function(){
   return jwt.sign({
      _id : this._id,
   },
   process.env.REFRESH_TOKEN_SECRET,
   {
      expiresIn : process.env.REFRESH_TOKEN_EXPIRY
   }
)
}






export const User = mongoose.model("User",userSchema)