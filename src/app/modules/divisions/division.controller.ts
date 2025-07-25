/* eslint-disable no-console */
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
import { divisionModel } from "./division.model";

// Creating divisions
const CreateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    // if (req.body.data && typeof req.body.data === 'string') {
    //   try {
    //     req.body = JSON.parse(req.body.data); 
    //   } catch (e) {
    //     throw new appError(StatusCodes.BAD_REQUEST, "Invalid JSON data in 'data' field");
    //   }
    // } 
        
    console.log({
      file:req.file,
      body:req.body
    });

    const payload :IDvision = {
      ...req.body,
      thumbnail:req.file?.path
    }
    const division: IDvision = await divisionServices.createDivision(payload);
    if (!division)
      throw new appError(StatusCodes.BAD_GATEWAY, "Somthing went wrong");
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Divison successfully created ",
      data: division,
    });
  }
);

// Get a singel Division\
const getSingelDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const singelDivision = await divisionServices.getSingelDivision(slug);
        if (Object.values(singelDivision).length === 0) {
          throw new appError(StatusCodes.BAD_REQUEST, "Tour id is not valid");
        }
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived a division",
      data: singelDivision,
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
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
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
        console.log(`Request for updating division id: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
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
  getSingelDivision,
};
