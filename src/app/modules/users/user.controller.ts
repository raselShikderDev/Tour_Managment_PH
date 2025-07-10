import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userServices } from "./user.services";
import appError from "../../errorHelper/appError";

const createUser = async (req: Request, res: Response, next:NextFunction) => {
  try {
    throw new appError(StatusCodes.BAD_REQUEST, "Fake Error by appError");
    
    const newUser = await userServices.createUser(req.body)

    if (Object.keys(newUser).length === 0) {
      res.status(StatusCodes.BAD_GATEWAY).json({
        success: false,
        message: "Faild to create User",
      });
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created",
      newUser,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // res.status(StatusCodes.BAD_REQUEST).json({
    //   success: false,
    //   message: `User creataion faild: ${error.message}`,
    //   error,
    // });
    next(error)
  }
};

export const userCcontroller ={
    createUser
}