// import { Router } from "express";
// import { registerUser } from "../controllers/user.controller.js";


// const router = Router()

// router.route("/register").post(registerUser)

// export default router

import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

import  {upload} from   "../middlewares/multer.middleware.js"



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





// Export the router
export default router;
