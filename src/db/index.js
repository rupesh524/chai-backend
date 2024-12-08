import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

//STORE IN A VARIABLE
const DB_CONNECT = async ()=>{
       try {
        //  connecxtion instance is live where is this particular running 
       const connectioninstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MONGODB connected  !! DB HOST : ${connectioninstance.connection.host}`);
           
       } catch (error) {
           console.error("MONGODB CONNECTION ERROR !! :", error);
           process.exit(1);    // nodejs hame option deta hai ki process ko exit karne ka direct keyworfd hai we can exit 
                            // process in many ways 
             
       }      
}




 export default DB_CONNECT ;









 // approch 1 isme sara index file me ho jata hsai toh index file bhot pollute ho jati hai 
/*

// async await intazar karta hai jis bhi chij pe await lagate hai uska intazar karta hai await 
(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

        app.on("error", (error)=>{     // connect express is express is not connect successfully then this will be executed
            console.log("Error :", error);
             throw error;
        })
        // if express sucessfully connected  
        app.listen(process.env.PORT ,()=>{
             console.log(`app is listening  on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("Error :",error)    // we can write console.log also here 
    }
}

)() // iify 
 */