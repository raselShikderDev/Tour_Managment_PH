import mongoose, { Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interfce";


const paymentSchema = new mongoose.Schema<IPayment>({
     booking:{
        type:Schema.Types.ObjectId,
        ref:"Bookings",
        required:true,
        unique:true,
    },
    transactionId:{
        type:String,
        required:true,
        unique:true
    },
    paymentGateway:{type:Schema.Types.Mixed},
    invoiceUrl:{type:String},
    status:{
        type:String,
        enum:Object.values(PAYMENT_STATUS),
        default:PAYMENT_STATUS.UNPAID,
    },
    amount:{type:Number}

},{
    timestamps:true,
    versionKey:false,
})

export const paymentModel = mongoose.model<IPayment>("Payments", paymentSchema)