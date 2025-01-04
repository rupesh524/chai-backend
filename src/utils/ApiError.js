class ApiError extends Error {

       constructor(
           statuscode,
           message  = "something went wrong",
           errors = [],
           stack = ""
       ){
          // used to call where we extend the class 
          super(message)
           this.statuscode = statuscode
           this.data = null
           this.message = message
           this.errors = errors
           this.success = false
       }
}
export {ApiError}