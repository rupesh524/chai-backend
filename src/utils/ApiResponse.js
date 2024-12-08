class ApiResponse{
        constructor(StatusCode,data,message = "Success"){
             this.StatusCode = StatusCode
             this.data = data
             this.message = message
             // 400 ke upar api error 
             this.success = StatusCode < 400
        }
}