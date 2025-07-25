import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyZodObject } from "zod";
import appError from "../errorHelper/appError";

export const validateRequest = (zodSchema:AnyZodObject)=> async (req: Request, res: Response,  next: NextFunction) => {
     if (req.body.data && typeof req.body.data === 'string') {
      try {
        req.body = JSON.parse(req.body.data); 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
        throw new appError(StatusCodes.BAD_REQUEST, error.message);
      }
    } 
    req.body = await zodSchema.parseAsync(req.body);
        // eslint-disable-next-line no-console
        console.log("ValidateRequest - User's provided data validated via Zod", req.body);
        next()
  }