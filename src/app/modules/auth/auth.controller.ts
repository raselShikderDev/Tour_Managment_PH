/* eslint-disable no-console */
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
import passport from "passport";

// Login by Passport credentials athentication and giving a access token to user API
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async(err:any, user:any, info:any)=>{
      // if(err) next(err)
      if(err) next( new appError(StatusCodes.BAD_REQUEST, err))
      
      if(!user) next(err)
      if(!user) next( new appError(StatusCodes.NOT_FOUND, info.message))


        const userTokens = await createUserToken(user)

        setAuthCookie(res, userTokens);

        const {password, ...rest} = user

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        accesToken:userTokens.accessToken,
        refreshToken:userTokens.refreshToken,
        user:rest,
      },
    });

    })(req, res, next)
  }
);

// // Login by credentials and giving a access token to user API
// const credentialsLogin = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const loggedinInfo = await authServices.credentialsLogin(req.body);

//     //    // Setting access Token and refresh token tradional way
//     //     res.cookie("refreshToken", loggedinInfo.refreshToken, {
//     //         httpOnly:true,
//     //         secure:false
//     //     })
//     //     res.cookie("accessToken", loggedinInfo.accessToken, {
//     //         httpOnly:true,
//     //         secure:false
//     //     })

//     // Setting access Token and refresh token with a utils function
//     setAuthCookie(res, loggedinInfo);

//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: "User logged in successfully",
//       data: loggedinInfo,
//     });
//   }
// );

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
 let redirect = req.query.state as string
 if (redirect.startsWith("/")){
  redirect = redirect.slice(1)
 }
  const user = req.user
  if (!user) {
    throw new appError(StatusCodes.NOT_FOUND, "User not found")
  }
  const userTokens = await createUserToken(user)
  // await setAuthCookie(res, userTokens)
  console.log(`frontendUtl: ${envVars.FRONEND_URL}`);
  
  res.redirect(`${envVars.FRONEND_URL as string}/${redirect}`)
})


// chnage user password
const chnagePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password successfully chnaged",
      data: null,
    });
  }
);

// chnage user password
const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;

    await authServices.setPassword(decodedToken as JwtPayload, newPassword);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password successfully set",
      data: null,
    });
  }
);

export const authController = {
  credentialsLogin,
  getNewAccessToken,
  logoutUser,
  resetPassword,
  googleCallback,
  chnagePassword,
  setPassword,
};
