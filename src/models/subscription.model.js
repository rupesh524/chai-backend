import mongoose , {Schema} from "mongoose"

const SubscriptionSchema = new Schema({
     Subscriber :{
            type : Schema.Types.ObjectId, // the one who is subsribing 
            ref : "User"

     },
     channel :{
           type : Schema.Types.ObjectId,   // one to whom the suscriber is subscribing 
           ref : "User" 
     }
},
{timestamps : true} )

export const Subscription =  new mongoose.model("Subscription",SubscriptionSchema)