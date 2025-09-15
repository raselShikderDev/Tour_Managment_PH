/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { envVars } from "../config/env";

export const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
      if (envVars.NODE_ENV === "Development") console.log(`in validateReq - req.body: `, req.body);

    if (req.body.data) {
     if (envVars.NODE_ENV === "Development") console.log(`in validateReq - req.body.data: `, req.body.data);
      req.body = JSON.parse(req.body.data);
    }
    req.body = await zodSchema.parseAsync(req.body);
   if (envVars.NODE_ENV === "Development") console.log(`in validateReq after validation - payload: `, req.body);

    next();
  };
