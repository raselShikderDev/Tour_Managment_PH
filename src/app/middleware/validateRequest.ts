/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest = (zodSchema:AnyZodObject)=> async (req: Request, res: Response,  next: NextFunction) => {
    
    req.body = await zodSchema.parseAsync(req.body);
        // eslint-disable-next-line no-console
        console.log(req.body);
  }