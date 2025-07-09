import { Request, Response } from "express";
import { userModel } from "./user.model";
import { StatusCodes } from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    const user = userModel.create({
      name,
      email,
    });

    // if (Object.keys(user).length === 0) {
    //   res.status(StatusCodes.).json({
    //     success: false,
    //     message: "User created",
    //     user,
    //   });
    // }

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created",
      user,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: `User creataion faild: ${error.message}`,
      error,
    });
  }
};

export const userCcontroller ={
    createUser
}