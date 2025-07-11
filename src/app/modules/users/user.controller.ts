/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userServices } from "./user.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Getting all user using custom async handleer - Which decrese using tryCatch repeatedly
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.getAllUser();


    // res.status(StatusCodes.CREATED).json({
    //   success: true,
    //   message: "User created",
    //   allUser,
    // });

    // Sending success Response using custom response
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "All users retrived successfully",
      data: result.data,
      meta: {
          total: result.meta, 
      },
    });
  }
);

// Creating a user using custom async handleer - Which decrese using tryCatch repeatedly
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await userServices.createUser(req.body);

    // if (Object.keys(newUser).length === 0) {
    //   res.status(StatusCodes.BAD_GATEWAY).json({
    //     success: false,
    //     message: "Faild to create User",
    //   });
    // }

    // res.status(StatusCodes.CREATED).json({
    //   success: true,
    //   message: "User created",
    //   newUser,
    // });

    // Sending success Response using custom response
    sendResponse(res, {
      statusCode:StatusCodes.CREATED,
      success:true,
      message:"User created successfully",
      data:newUser,
    })
  }
);

// // Creating controller in a traditional way with usign again and again try catch
// const createUser = async (req: Request, res: Response, next:NextFunction) => {
//   try {
//     // throw new appError(StatusCodes.BAD_REQUEST, "Fake Error by appError");

//     const newUser = await userServices.createUser(req.body)

// if (Object.keys(newUser).length === 0) {
//   res.status(StatusCodes.BAD_GATEWAY).json({
//     success: false,
//     message: "Faild to create User",
//   });
// }

// res.status(StatusCodes.CREATED).json({
//   success: true,
//   message: "User created",
//   newUser,
// });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     // res.status(StatusCodes.BAD_REQUEST).json({
//     //   success: false,
//     //   message: `User creataion faild: ${error.message}`,
//     //   error,
//     // });
//     next(error)
//   }
// };

export const userCcontroller = {
  createUser,
  getAllUsers,
};
