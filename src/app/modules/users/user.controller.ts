/* eslint-disable no-console */
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
      statusCode: StatusCodes.OK,
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
    console.log("Controller - Got request for create a user ");
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

const updateUser = catchAsync(async( req: Request, res: Response, next: NextFunction)=>{
  console.log("Controller - Got request for updating user");
  
  const userEmail = req.params.email
    console.log("Controller - userEmail: ", userEmail);
    console.log("Controller - req.body : ", req.body);

  const updatedUserInfo = await userServices.updateUser(userEmail as string, req.body)
  sendResponse(res, {
      statusCode:StatusCodes.OK,
      success:true,
      message:"User updated successfully",
      data:updatedUserInfo,
    })
})


export const userCcontroller = {
  createUser,
  getAllUsers,
  updateUser,
};
