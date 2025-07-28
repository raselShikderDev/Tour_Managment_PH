/* eslint-disable @typescript-eslint/no-explicit-any */
import { bookingModel } from "../booking/boooking.model";
import { paymentModel } from "./payment.model";
import { PAYMENT_STATUS } from "./payment.interfce";
import { BOOKING_STATUS } from "../booking/booking.interface";
import appError from "../../errorHelper/appError";
import { StatusCodes } from "http-status-codes";
import { sslServicess } from "../sslcommerz/sslcommerce.service";
import { ISSLCommerz } from "../sslcommerz/sslcommerce.interface";



// Updating Payment sataus to paid
const initPayment = async (bookingId: string) => {
  // Update Booking status to confirm
  // Update payment status to paid

  // Update payment
  const session = await bookingModel.startSession();
  session.startTransaction();
  try {
    
    const payment = await paymentModel.findOne({booking:bookingId})
    if(!payment){
      throw new appError(StatusCodes.BAD_REQUEST, "Payment is not found")
    }

    const booking = await bookingModel.findById(bookingId)
const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPaylaod: ISSLCommerz = {
      amount: payment.amount,
      transactionId: payment.transactionId,
      name: userName,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      address: userAddress,
    };

    const sslPayment = await sslServicess.sslPaymentInit(sslPaylaod);
    session.commitTransaction();
    session.endSession();
    return {
      paymentUrl: sslPayment.GatewayPageURL
    };
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Updating Payment sataus to paid
const successPayment = async (query: Record<string, string>) => {
  // Update Booking status to confirm
  // Update payment status to paid

  // Update payment
  const session = await bookingModel.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await paymentModel.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      {runValidators: true, session: session }
    );
    // Update Booking
    await bookingModel
      .findByIdAndUpdate(
        updatedPayment?.booking,
        { status: BOOKING_STATUS.COMPLETED },
        { runValidators: true, session: session }
      )
    session.commitTransaction();
    session.endSession();
    return {
      success: true,
      successfully: "Payment completed successfully",
    };
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Updating Payment sattus to fail
const failPayment = async (query: Record<string, string>) => {
  // Update Booking status to confirm
  // Update payment status to paid

  // Update payment
  const session = await bookingModel.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await paymentModel.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILD },
      {runValidators: true, session: session }
    );
    // Update Booking
    await bookingModel
      .findByIdAndUpdate(
        updatedPayment?.booking,
        { status: BOOKING_STATUS.FAILD },
        { runValidators: true, session: session }
      )
    session.commitTransaction();
    session.endSession();
    return {
      success: false,
      successfully: "Payment faild",
    };
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Updating Payment statu to cancel
const cancelPayment = async (query: Record<string, string>) => {
  // Update Booking status to cancel
  // Update payment status to Unpaid

  // Update payment
  const session = await bookingModel.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await paymentModel.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELED },
      {runValidators: true, session: session }
    );
    // Update Booking
    await bookingModel
      .findByIdAndUpdate(
        updatedPayment?.booking,
        { status: BOOKING_STATUS.CANCELED },
        { runValidators: true, session: session }
      )
    session.commitTransaction();
    session.endSession();
    return {
      success: false,
      successfully: "Payment canceled",
    };
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw error;
  }
};


export const paymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
