/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { tourServices, tourTypeServices } from "./tour.services";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { envVars } from "../../config/env";
import mongoose from "mongoose";
import { ITour } from "./tour.interface";

/**--------------------------- Tour types Controller -------------------------- */
//Creating tourType
const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const newTourType = await tourTypeServices.createTourType(payload);
    if (!newTourType) {
      throw new appError(StatusCodes.BAD_GATEWAY, "Somthing went wrong");
    }

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "TourType successfully created ",
      data: newTourType,
    });
  }
);

//Retriving all TourType
const getAllTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allTourType = await tourTypeServices.getAllTourType();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived TourType",
      data: allTourType,
    });
  }
);

//Retriving all TourType
const getSingelTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
        console.log("Got request in tourtype controler for singel tour by id :", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new appError(StatusCodes.BAD_REQUEST, "TourType id is not valid");
    }
    const TourType = await tourTypeServices.getSingelTourType(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived TourType",
      data: TourType,
    });
  }
);

// Deleteing a TourType
const deleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new appError(StatusCodes.BAD_REQUEST, "TourType id is not valid");
    }
    await tourTypeServices.deleteTourType(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully deleted a tourType",
      data: null,
    });
  }
);

// Updating a TourType
const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new appError(StatusCodes.BAD_REQUEST, "TourType id is not valid");
    }
    const payload = req.body;
    const updatedNewdTourType = await tourTypeServices.updateTourType(
      id,
      payload
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully updated a TourType",
      data: updatedNewdTourType,
    });
  }
);

export const tourTypeController = {
  createTourType,
  getAllTourType,
  deleteTourType,
  updateTourType,
  getSingelTourType,
};

/**------------------------------ Tour Controller -------------------------------- */
//Creating tour
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
     const payload:ITour = {
      ...req.body,
      images:(req.files as Express.Multer.File[]).map((file)=>file.path)
    }
    
    const newTour = await tourServices.createTour(payload);
    if (!newTour) {
      throw new appError(StatusCodes.BAD_GATEWAY, "Somthing went wrong");
    }

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Tour successfully created ",
      data:newTour,
    });
  }
);

// get singel tour by slug
const getSingelTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Got request in tour controler for singel tour by slug :", req.params.slug);
    
    const slug: string = req.params.slug;
    const singelTour = await tourServices.getSingelTour(slug);
    if (Object.values(singelTour).length === 0) {
      throw new appError(StatusCodes.BAD_REQUEST, "Tour id is not valid");
    }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived a tour",
      data: singelTour,
    });
  }
);

//Retriving all Tour
const getAllTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const allTour = await tourServices.getAllTour(
      query as Record<string, string>
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully retrived Tours",
      data: allTour,
    });
  }
);

// Deleteing a Tour
const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new appError(StatusCodes.BAD_REQUEST, "Tour id is not valid");
    }
    await tourServices.deleteTour(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully deleted a tour",
      data: null,
    });
  }
);

// Updating a Tour
const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new appError(StatusCodes.BAD_REQUEST, "Tour id is not valid");
    }
    const payload:ITour = {
      ...req.body,
      images:(req.files as Express.Multer.File[]).map((file)=>file.path)
  }
    
    const updatedNewdTour = await tourServices.updateTour(id, payload);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully updated a Tour",
      data: updatedNewdTour,
    });
  }
);

export const tourController = {
  createTour,
  getAllTour,
  deleteTour,
  updateTour,
  getSingelTour,
};
