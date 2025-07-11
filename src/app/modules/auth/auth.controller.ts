/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.service";

const credentialsLogin = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
   const loginInfo = await authServices.credentialsLogin(req.body)
   console.log(loginInfo);
   
})

export const authController ={
    credentialsLogin
}

