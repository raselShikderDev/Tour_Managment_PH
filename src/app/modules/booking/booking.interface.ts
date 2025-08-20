// User -> Booking (Pending) -> Payment (unpaid) -> SSLCommerz -> Booking status chnage to Confrim -> Payment status chnage to paid ->

import { Types } from "mongoose";


export enum BOOKING_STATUS {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILD ="FAILD",
    CANCELED = "CANCELED"
}

export interface Ibooking{
    user:Types.ObjectId,
    tour:Types.ObjectId,
    payment:Types.ObjectId,
    guestCount:number,
    status: BOOKING_STATUS,
    createdAt?:Date;
}