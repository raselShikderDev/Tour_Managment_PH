/* eslint-disable @typescript-eslint/no-explicit-any */
import { bookingModel } from "../booking/boooking.model";
import { paymentModel } from "./payment.model";
import { PAYMENT_STATUS } from "./payment.interfce";
import { BOOKING_STATUS } from "../booking/booking.interface";
import appError from "../../errorHelper/appError";
import { StatusCodes } from "http-status-codes";
import { sslServicess } from "../sslcommerz/sslcommerce.service";
import { ISSLCommerz } from "../sslcommerz/sslcommerce.interface";
import { generateInvoice, IInvoiceInfo } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { IUser } from "../users/user.interface";
import { ITour } from "../tours/tour.interface";

// Updating Payment sataus to paid
const initPayment = async (bookingId: string) => {
  // Update Booking status to confirm
  // Update payment status to paid

  // Update payment
  const session = await bookingModel.startSession();
  session.startTransaction();
  try {
    const payment = await paymentModel.findOne({ booking: bookingId });
    if (!payment) {
      throw new appError(StatusCodes.BAD_REQUEST, "Payment is not found");
    }

    const booking = await bookingModel.findById(bookingId);
    const userAddress = (booking?.user as any).address;
    const userEmail = (booking?.user as any).email;
    const userPhoneNumber = (booking?.user as any).phone;
    const userName = (booking?.user as any).name;

    const sslPaylaod: ISSLCommerz = {
      amount: payment.amount,
      transactionId: payment.transactionId,
      name: userName,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      address: userAddress,
    };

    const sslPayment = await sslServicess.sslPaymentInit(sslPaylaod);
    await session.commitTransaction();
    session.endSession();
    return {
      paymentUrl: sslPayment.GatewayPageURL,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
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
      { runValidators: true, new: true, session: session }
    );

    if (!updatedPayment) {
      throw new appError(StatusCodes.BAD_REQUEST, "Updating Payment is failed");
    }

    // Update Booking
    const updatedBooking = await bookingModel
      .findByIdAndUpdate(
        updatedPayment?.booking,
        { status: BOOKING_STATUS.COMPLETED },
        { runValidators: true, new: true, session: session }
      )
      .populate("tour", "title")
      .populate("user", "name email");

    if (!updatedBooking) {
      throw new appError(StatusCodes.BAD_REQUEST, "Updating booking is failed");
    }

    // Creating pdf and updating pdf
    const invoiceData: IInvoiceInfo = {
      bookingDate: updatedBooking?.createdAt as Date,
      transactionId: updatedPayment.transactionId,
      userName: (updatedBooking.user as unknown as IUser).name,
      tourTitle: (updatedBooking.tour as unknown as ITour).title,
      guestCount: updatedBooking.guestCount,
      totalAmount: updatedPayment.amount,
    };
    let generatedPDF;
    try {
      generatedPDF = await generateInvoice(invoiceData);
    } catch (error: any) {
      throw new appError(501, `Generating invoice is failed ${error.message}`);
    }
    // Sending email to user's email
    try {
      await sendEmail({
        to: (updatedBooking.user as unknown as IUser).email,
        subject: "Paymaynet successfully completed",
        templateName: "paymentCompleted",
        templateData: {
          name: (updatedBooking.user as unknown as IUser).name,
          amount: updatedPayment.amount,
          tourName: (updatedBooking.tour as unknown as ITour).title,
          transactionId: updatedPayment.transactionId,
        },
        attachments: [
          {
            filename: "invoice.pdf",
            content: generatedPDF,
            contentType: "application/pdf",
          },
        ],
      });
    } catch (error: any) {
      throw new appError(
        501,
        `Sending invoice to email is failed ${error.message}`
      );
    }

    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      successfully: "Payment completed successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
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
      { runValidators: true, session: session }
    );
    // Update Booking
    await bookingModel.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILD },
      { runValidators: true, session: session }
    );
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
      { runValidators: true, session: session }
    );
    // Update Booking
    await bookingModel.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCELED },
      { runValidators: true, session: session }
    );
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
