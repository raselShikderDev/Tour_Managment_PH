// User -> Booking (Pending) -> Payment (unpaid) -> SSLCommerz -> Booking status chnage to Confrim -> Payment status chnage to paid ->

import { Types } from "mongoose";
import { ITour } from "../tours/tour.interface";
import { IPayment } from "../payment/payment.interfce";


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


export interface ISndResponseTour {
  title: string;
  costForm: number;
  location: string;
  startDate: Date;
}

export interface ISndResponsePayment {
  _id: Types.ObjectId;
  amount: number;
}

export interface ISndResponseBooking {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  tour: ITour;
  guestCount: number;
  status: string;
  payment: IPayment;
  startDate?: Date;
}