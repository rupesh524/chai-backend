class ApiError extends Error {

       constructor(
           statuscode,
           message  = "something went wrong",
           errors = [],
           statck = ""
       ){
          super(message)
           this.statuscode = statuscode
           this.data = null
           this.message = message
           this.errors = errors
           this.success = false
       }
}
export {ApiError}