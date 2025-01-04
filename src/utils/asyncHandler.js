
const asyncHandler = (requestHandler) => {
       return (req, res, next) => {
         Promise.resolve(requestHandler(req, res, next))
           .catch((err) => next(err));
       };
     };
     
     export { asyncHandler };



// try catch way 
// functioon inside function 
// make the second function as async 
// const asyncHandler = (func)=>  async (req,res,next) =>{
//        try {
//            await func(req,res,next)
//        } catch (error) {
//            res.status(err.code || 500).json({
//               success : false,
//               message : err.message
//            })
//        }

// }