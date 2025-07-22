
import mongoose, { Schema } from "mongoose";
import { BOOKING_STATUS, Ibooking } from "./booking.interface";


const bookingSchema = new mongoose.Schema<Ibooking>({
    user:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    tour:{
        type:Schema.Types.ObjectId,
        ref:"Tour",
        required:true,
    },
    payment:{
        type:Schema.Types.ObjectId,
        ref:"Payments",
    },
    guestCount:{
        type:Number
    },
    status:{
        type:String,
        enum:Object.values(BOOKING_STATUS),
        default:BOOKING_STATUS.PENDING
    }
})

export const bookingModel = mongoose.model<Ibooking>("Bookings", bookingSchema)