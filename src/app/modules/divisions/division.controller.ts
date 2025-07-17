/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { divisionServices } from "./divison.services";
import { IDvision } from "./division.interface";
import appError from "../../errorHelper/appError";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { envVars } from "../../config/env";
import mongoose from "mongoose";

// Creating divisions
const CreateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const division: IDvision = await divisionServices.createDivision(req.body);
    if (!division)
      throw new appError(StatusCodes.BAD_GATEWAY, "Division creating is faild");
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Divison successfully created ",
      data: division,
    });
  }
);

// Retriving all divions
const getAllDivisions = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
    const allDivisons = await divisionServices.getAllDivisions()
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived Divisons",
      data: allDivisons,
    });
})

// Deleting a divion
const deleteDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
    const id = req.params.id
    if (mongoose.Types.ObjectId.isValid(id)) {
        throw new appError(StatusCodes.BAD_REQUEST, "Division id is not valid")
    }
    const deletedDivision = await divisionServices.deleteDivision(id)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully deleted a Divisons",
      data: envVars.NODE_ENV === "Development" ? deletedDivision : null,
    });
})

// Updating a divion
const updateDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
    const id = req.params.id
    if (mongoose.Types.ObjectId.isValid(id)) {
        throw new appError(StatusCodes.BAD_REQUEST, "Division id is not valid")
    }
    const payload = req.body
    const updatedNewdDivision = await divisionServices.updateDivision(id, payload)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully updated a Divison",
      data: updatedNewdDivision,
    });
})

export const divisionController = {
  CreateDivision,
  getAllDivisions,
  deleteDivision,
  updateDivision,
};
