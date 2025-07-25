import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest = (zodSchema:AnyZodObject)=> async (req: Request, res: Response,  next: NextFunction) => {
    req.body = JSON.parse(req.body.data) || req.body
    req.body = await zodSchema.parseAsync(req.body);
        // eslint-disable-next-line no-console
        console.log("ValidateRequest - User's provided data validated via Zod", req.body);
        next()
  }