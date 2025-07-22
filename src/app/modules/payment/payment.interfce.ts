import { Types } from "mongoose";


export enum PAYMENT_STATUS {
    UNPAID = "UNPAID",
    PAID = "PAID",
    CANCELED = "CANCELED",
    FAILD ="FAILD",
    REFUNDED ="REFUNDED",
}

export interface IPayment {
    booking:Types.ObjectId,
    bookingId:string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paymentGateway?:any,
    invoieUrl?:string,
    status:PAYMENT_STATUS,
    amount:number,
}