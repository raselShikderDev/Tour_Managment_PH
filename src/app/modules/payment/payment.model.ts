//  booking:Types.ObjectId,
//     bookingId:string,
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     paymentGateway?:any,
//     invoieUrl?:string,
//     status:PAYMENT_STATUS,
//     amount:number,

import mongoose, { Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interfce";


const paymentSchema = new mongoose.Schema<IPayment>({
     booking:{
        type:Schema.Types.ObjectId,
        ref:"Bookings",
        required:true,
        unique:true,
    },
    bookingId:{
        type:String,
        required:true,
        unique:true
    },
    paymentGateway:{type:Schema.Types.Mixed},
    invoieUrl:{type:String},
    status:{
        type:String,
        enum:Object.values(PAYMENT_STATUS),
        default:PAYMENT_STATUS.UNPAID,
    },
    amount:{type:Number}

})

export const paymentModel = mongoose.model<IPayment>("Payments", paymentSchema)