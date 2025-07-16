import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

/* eslint-disable no-console */
type asyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync =
  (fn: asyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (envVars.NODE_ENV === "Development") {
        console.log(err);
      }

      next(err);
    });
  };

export default catchAsync;
