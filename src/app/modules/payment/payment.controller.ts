
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import mongoose from "mongoose";

/**--------------------------- Tour types Controller -------------------------- */
//Creating Payment
const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
   
    // if (!newTourType) {
    //   throw new appError(StatusCodes.BAD_GATEWAY, "Somthing went wrong");
    // }

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "TourType successfully created ",
      data: null,
    });
  }
);

//Retriving all Payment
const getAllPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allTourType = null
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived TourType",
      data: allTourType,
    });
  }
);

//Retriving a Payment
const getSingelPayment= catchAsync(
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

// Deleteing a Payment
const deletePayment = catchAsync(
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

// Updating a Payment
const updatePayment = catchAsync(
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

export const paymentController = {
  createPayment,
  getAllPayment,
  deletePayment,
  updatePayment,
  getSingelPayment,
};