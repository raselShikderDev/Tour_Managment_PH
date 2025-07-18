/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { tourServices } from "./tour.services";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { envVars } from "../../config/env";
import { tourModel } from "./tour.model";
import mongoose from "mongoose";

//Creating tour
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const newTour = await tourServices.createTour(payload)
     if (!newTour) {
    throw new appError(StatusCodes.BAD_GATEWAY, "Somthing went wrong");
  }

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Divison successfully created ",
      data: newTour,
    });
})

//Retriving all Tour 
const getAllTour = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const allTour = await tourServices.getAllTour()
     sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived Tours",
      data: allTour,
    });
})

// Deleteing a Tour
const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
    const id = req.params.id
    if (mongoose.Types.ObjectId.isValid(id)) {
        throw new appError(StatusCodes.BAD_REQUEST, "Division id is not valid")
    }
    const deletedtour = await tourServices.deleteTour(id)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully deleted a tour",
      data: envVars.NODE_ENV === "Development" ? deletedtour : null,
    });
})

// Updating a Tour
const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
    const id = req.params.id
    if (mongoose.Types.ObjectId.isValid(id)) {
        throw new appError(StatusCodes.BAD_REQUEST, "Division id is not valid")
    }
    const payload = req.body
    const updatedNewdTour = await tourServices.updateTour(id, payload)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully updated a Tour",
      data: updatedNewdTour,
    });
})

export const tourController ={
    createTour,
    getAllTour,
    deleteTour,
    updateTour,
}