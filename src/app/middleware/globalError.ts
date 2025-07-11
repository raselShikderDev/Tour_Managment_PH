/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import appError from "../errorHelper/appError"

export const globalError = (err:any, req:Request, res:Response, next:NextFunction)=>{
    let statusCode = 500
    let message = `Somthing went wrong in ${err.message} from global error`

    if (err instanceof appError) {
        statusCode = err.statusCode
        message = err.message
    } else if(err instanceof Error){
        statusCode = 501
        message = err.message
    }

    res.status(statusCode).json({
        success:false,
        message,
        err,
        stack: envVars.NODE_ENV === "Development" ? err.stack : null
    })
}