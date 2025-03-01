// import { Router } from "express";
// import { registerUser } from "../controllers/user.controller.js";


// const router = Router()

// router.route("/register").post(registerUser)

// export default router

import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, GetWatchHistory, registerUser, updateAccountDetails, UpdateCoverImage, updateUserAvatar } from "../controllers/user.controller.js";
import { loginUser} from "../controllers/user.controller.js"
import  {upload} from   "../middlewares/multer.middleware.js"
import { LogoutUser } from "../controllers/user.controller.js";
import { verifyJWT}  from "../middlewares/auth.middleware.js"
import { refreshAccessToken } from "../middlewares/auth.middleware.js"
const router = Router();

// Define the POST route for user registration
router.route("/register").post(
     upload.fields([     // enjecting middileware
        {
            name : "avatar",
            maxCount : 1
        },
        {
             name : "coverImage",
             maxCount : 1
        },

     ]),
    registerUser
);

router.route("/login").post(loginUser)
 

// secured route first go to verifyjwt middleware the logout the user  securedf because user is logged in 
router.route("/logout").post(verifyJWT, LogoutUser)


// isme verify jwt ki jarurat nahi hai 
router.route("/refresh-token").post(refreshAccessToken)


router.route("/change-password").post(verifyJWT,changeCurrentPassword);     // verify jwt means logged in user hi usko 
                                                                        // change kar paye

router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-account").patch(verifyJWT,updateAccountDetails); // post me sari details update ho jayegi hamko 
                                                    // sari details update nahi karna thi 

 // khali avatar update karna hai toh patch then only single file toh upload middileware me single then method call
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)


router.route("/cover-image").patch(verifyJWT,upload.single("/coverImage"),UpdateCoverImage);


// particular username ke channel ki profile nikalni hai toh ese hi likhna padega 
router.route("/c/:username").get(verifyJWT,getUserChannelProfile);

router.route("/history").get(verifyJWT,GetWatchHistory);


// Export the router
export default router;
