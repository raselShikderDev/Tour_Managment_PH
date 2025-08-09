/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { otpServices } from "./otp.services";

// chaning user password based on user token in case of while user need to chnage password
const sendOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await otpServices.otpSend(req.body.email, req.body.name)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Successfully OTP send to user email",
      data: null,
    });
  }
);

// chaning user password based on user token in case of while user need to chnage password
const verifyOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await otpServices.verifyOtp(req.body.email, req.body.otp)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "successfully OTP verified",
      data: null,
    });
  }
);

export const otpController = {
  sendOtp,
  verifyOtp,
};
