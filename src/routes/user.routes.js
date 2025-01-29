// import { Router } from "express";
// import { registerUser } from "../controllers/user.controller.js";


// const router = Router()

// router.route("/register").post(registerUser)

// export default router

import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser} from "../controllers/user.controller.js"
import  {upload} from   "../middlewares/multer.middleware.js"
import { LogoutUser } from "../controllers/user.controller.js";
import { verifyJWT}  from "../middlewares/auth.middleware.js"
import { requestAccessToken } from "../middlewares/auth.middleware.js"
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

// Export the router
export default router;
