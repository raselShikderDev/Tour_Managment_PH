/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import appError from "../errorHelper/appError";

/**Duplicate error Mongoose */

/**Mongoose cast Error */

/** Mongoose validation error */

const errorsSource:any = []

export const globalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Somthing went wrong in ${err.message} from global error`;

  // Cast Error / Object id error
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid Mongodb Object Id, Provide a valid id";
  }
  // Mongoose validation error
  else if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors)
    errors.forEach((errorObject:any)=>{
      errorsSource.push({
        path:errorObject.path,
        message:errorObject.message
      })
    })
    message = `Validation Error`;
  }
  // Duplicate Error
  else if (err.code === 1000) {
    // eslint-disable-next-line no-console
    console.log("Duplicate error");
    const matchedArray = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${matchedArray[1]} already exists`;
  } else if (err instanceof appError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 501;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorsSource,
    // err,
    stack: envVars.NODE_ENV === "Development" ? err.stack : null,
  });
};
