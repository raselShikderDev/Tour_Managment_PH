/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { paymentServices } from "./payment.services";
import { envVars } from "../../config/env";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { sslServicess } from "../sslcommerz/sslcommerce.service";


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


// get singel Payment's invoice url
const SinglepaymentInvoiceUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   const paymentId = req.params.paymentid
   const decodedToken = req.user
   const result = await paymentServices.SinglepaymentInvoiceUrl(paymentId, decodedToken as JwtPayload)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Invoice successfully retrived ",
        data: result,
    });
  }
);

// get all Payment's invoice url - only admins are allowed
const invoicesAllpayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   const result = await paymentServices.invoicesAllpayment()
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "All invoice successfully retrived ",
        data: result,
    });
  }
);

const validatePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.log(`SSL req.body: ${req.body}`);
    
   const result = await sslServicess.PaymentValidator(req.body)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Payment successfully verified",
        data: result,
    });
  }
);



export const paymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  validatePayment,
  SinglepaymentInvoiceUrl,
  invoicesAllpayment,
};