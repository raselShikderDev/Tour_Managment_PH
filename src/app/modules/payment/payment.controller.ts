/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { paymentServices } from "./payment.services";
import { envVars } from "../../config/env";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


// Initial Payment
const initPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   const bookingid = req.params.bookingid
   const result = await paymentServices.initPayment(bookingid)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
  }
);

//Success Payment
const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   const query = req.query
   const result = await paymentServices.successPayment(query as Record<string, string>)
   if(result?.success){
    res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL as string}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=success$`)
   }
  }
);

//Fail Payment
const failPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   const query = req.query
   const result = await paymentServices.successPayment(query as Record<string, string>)
   if(result?.success){
    res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL as string}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=fail$`)
   }
  }
);

//Cancel Payment
const cancelPayment = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
   const query = req.query
   const result = await paymentServices.successPayment(query as Record<string, string>)
   if(result?.success){
    res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL as string}?transactionId=${req.query.transactionId}&amount=${req.query.amount}&status=cancel$`)
   }
  }
);





export const paymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};