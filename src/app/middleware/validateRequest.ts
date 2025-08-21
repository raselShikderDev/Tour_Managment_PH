/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("In validaterequest - req.body:", req.body);
    if(req.body.data) console.log("In validaterequest - req.body.data:", req.body.data);

    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    req.body = await zodSchema.parseAsync(req.body);
    console.log(
      "ValidateRequest - User's provided data validated via Zod",
      req.body
    );
    next();
  };
