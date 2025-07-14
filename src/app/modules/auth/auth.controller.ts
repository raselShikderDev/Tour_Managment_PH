/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import appError from "../../errorHelper/appError";
import { createUserToken } from "../../utils/userTokens";
import { envVars } from "../../config/env";

// Login by credentials and giving a access token to user API
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedinInfo = await authServices.credentialsLogin(req.body);

    //    // Setting access Token and refresh token tradional way
    //     res.cookie("refreshToken", loggedinInfo.refreshToken, {
    //         httpOnly:true,
    //         secure:false
    //     })
    //     res.cookie("accessToken", loggedinInfo.accessToken, {
    //         httpOnly:true,
    //         secure:false
    //     })

    // Setting access Token and refresh token with a utils function
    setAuthCookie(res, loggedinInfo);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: loggedinInfo,
    });
  }
);

// Generating new access token by refresh token API
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToen = req.cookies.refreshToken;
    const newAccessToen = await authServices.newAccessToken(
      refreshToen as string
    );
    setAuthCookie(res, newAccessToen);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "New access token retrived successfully",
      data: newAccessToen.accessToken,
    });
  }
);

// Logout user by deleting accessToken and refreshToken from cookies
const logoutUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User successfully logout",
      data: null,
    });
  }
);

// Reseting user password
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await authServices.resetPassword(newPassword, oldPassword, decodedToken as JwtPayload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password successfully reset",
      data: null,
    });
  }
);

// Handling google authentiction "/Google/callback" route
const googleCallback = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
  const user = req.user
  if (!user) {
    throw new appError(StatusCodes.NOT_FOUND, "User not found")
  }
  const userTokens = await createUserToken(user)
  await setAuthCookie(res, userTokens)
  res.redirect(envVars.FRONEND_URL as string)
})

export const authController = {
  credentialsLogin,
  getNewAccessToken,
  logoutUser,
  resetPassword,
  googleCallback,
};
