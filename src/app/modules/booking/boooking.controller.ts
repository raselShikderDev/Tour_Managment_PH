
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import mongoose from "mongoose";
import { bookingServices } from "./booking.services";
import { JwtPayload } from "jsonwebtoken";


//Creating Booking
const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const decodedToken = req.user as JwtPayload
  //  console.log(`User from req: ${req.user}`)
   const bookings = await bookingServices.createBooking(payload, decodedToken.userId)

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Booking successfully created ",
      data: bookings,
    });
  }
);

//Retriving all Booking
const getAllBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allBooking = bookingServices.getAllBooking()
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived booking",
      data: allBooking,
    });
  }
);

//Retriving my Booking
const myBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const booking = await bookingServices.myBookings(decodedToken as JwtPayload )
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived booking",
      data: booking,
    });
  }
);
//Retriving Completed my Booking
const myCompletedBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const booking = await bookingServices.myBookings(decodedToken as JwtPayload )
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived completed bookings",
      data: booking,
    });
  }
);
//Retriving my ending Booking
const myPendingsBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const booking = await bookingServices.myBookings(decodedToken as JwtPayload )
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived pendings bookings",
      data: booking,
    });
  }
);

//Retriving a Booking
const getSingelBooking= catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new appError(StatusCodes.BAD_REQUEST, "TourType id is not valid");
    }
    const TourType = null
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived TourType",
      data: TourType,
    });
  }
);

// Deleteing a Booking
const deleteBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new appError(StatusCodes.BAD_REQUEST, "TourType id is not valid");
    }
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully deleted a tourType",
      data: null,
    });
  }
);

// Updating a Booking
const updateBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new appError(StatusCodes.BAD_REQUEST, "TourType id is not valid");
    }
    const payload = req.body;
    const updatedNewdTourType = null
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully updated a TourType",
      data: updatedNewdTourType,
    });
  }
);

export const bookingController = {
  createBooking,
  getAllBooking,
  deleteBooking,
  updateBooking,
  getSingelBooking,
  myBookings,
  myPendingsBookings,
  myCompletedBookings,
};