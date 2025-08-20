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
    transactionId:string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paymentGateway?:any,
    invoiceUrl?:string,
    status:PAYMENT_STATUS,
    amount:number,
}