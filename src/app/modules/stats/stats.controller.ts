/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { StatsService } from "./stats.service"
import sendResponse from "../../utils/sendResponse"
import { StatusCodes } from "http-status-codes"



const getBookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsService.getBookingStats()

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All bookings stats retrived successfully",
      data: result,
    });
  }
)


const getPaymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsService.getPaymentStats()

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All payments stats retrived successfully",
      data: result,
    });
  }
)

// Getting all users stats
const getUserStats =catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsService.getUserStats()

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All users stats retrived successfully",
      data: result,
    });
  }
)
const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsService.getTourStats()

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All tour stats retrived successfully",
      data: result,
    });
  }
)
export const StatsController = {
getBookingStats, 
getPaymentStats,
getTourStats,
getUserStats,
}