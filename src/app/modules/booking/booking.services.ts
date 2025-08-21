/* eslint-disable @typescript-eslint/no-unused-vars */

import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { BOOKING_STATUS, Ibooking } from "./booking.interface";
import { userModel } from "../users/user.model";
import { tourModel } from "../tours/tour.model";
import { bookingModel } from "./boooking.model";
import { paymentModel } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interfce";
import { sslServicess } from "../sslcommerz/sslcommerce.service";
import { ISSLCommerz } from "../sslcommerz/sslcommerce.interface";
import { generateTransactionId } from "../../utils/getTransaction";



// Creating Booking
const createBooking = async (payload: Partial<Ibooking>, userId: string) => {
  const session = await bookingModel.startSession();
  session.startTransaction();

  try {
    const user = await userModel.findById(userId);
    if (!user?.phone || !user.address) {
      throw new appError(
        StatusCodes.BAD_REQUEST,
        "Please update your profile to book a tour"
      );
    }

    const tour = await tourModel.findById(payload.tour).select("costForm");

    if (!tour || typeof tour.costForm !== "number") {
      throw new appError(
        StatusCodes.BAD_REQUEST,
        "No valid cost found for this tour"
      );
    }
    if (!tour) {
      throw new appError(StatusCodes.BAD_REQUEST, "No tour cost found");
    }

    // console.log("tourCost: ", tour.costForm);

    // console.log("payload.guestCount: ", payload.guestCount);

    const amount = Number(tour.costForm) * Number(payload.guestCount);
    // console.log(`Amount: ${amount}`);

    const transId = generateTransactionId(userId);
    const booking = await bookingModel.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );
    
    const payment = await paymentModel.create(
      [{
        booking: booking[0]._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: transId,
        amount: amount,
      }],
      { session }
    );

    const updatedBooking = await bookingModel
      .findByIdAndUpdate(
        booking[0]._id,
        { payment: payment[0]._id },
        { new: true, runValidators: true, session }
      )
      .populate("user", "name email phone address")
      .populate("tour", "title costForm")
      .populate("payment");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userEmail = (updatedBooking?.user as any).email;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userName = (updatedBooking?.user as any).name;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userAddress = (updatedBooking?.user as any).address;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userPhone = (updatedBooking?.user as any).phoneNumber;

    const sslPaylaod: ISSLCommerz = {
      amount: Number(amount),
      transactionId: transId,
      name: userName,
      email: userEmail,
      phoneNumber: userPhone,
      address: userAddress,
    };

    const sslPayment = await sslServicess.sslPaymentInit(sslPaylaod);
    // console.log("sslPayment: ", sslPayment);
    

    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally{
    session.endSession();
  }
};

// Retriving all tours
const getAllBooking = async () => {
  return {
    meta: {
      total: null,
    },
    data: null,
  };
};

// Get singel a Booking by id
const getSingelBooking = async (id: string) => {
  const Booking = null;

  return Booking;
};

// Deleting a Booking
const deleteBooking = async (id: string) => {
  const deletedABooking = null;
  if (!deleteBooking)
    throw new appError(StatusCodes.NOT_FOUND, "Booking not found");
  return deletedABooking;
};

// Updating Booking
const updateBooking = async (id: string, payload: Partial<Ibooking>) => {
  if (!payload)
    throw new appError(
      StatusCodes.NOT_FOUND,
      "Booking's updated infromation not found"
    );

  const isExist = null;
  if (!isExist) {
    throw new appError(StatusCodes.NOT_FOUND, "Booking not found");
  }

  const isDuplicate = null;
  if (isDuplicate !== null) {
    throw new appError(
      StatusCodes.BAD_REQUEST,
      "A Booking with this title already exists"
    );
  }

  const updatedNewBooking = null;
  if (!updatedNewBooking)
    throw new appError(StatusCodes.NOT_FOUND, "Booking not found");

  return updatedNewBooking;
};

export const bookingServices = {
  createBooking,
  getAllBooking,
  deleteBooking,
  updateBooking,
  getSingelBooking,
};
