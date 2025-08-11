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
    console.log("Recevif losign request in controller", req.body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      // if(err) next(err)
      if (err) {
        return next(new appError(StatusCodes.BAD_REQUEST, err.message));
      }

      if (!user) {
        if(info.message === "User is not verified"){
          return next(new appError(401, info.message));
        }
        return next(new appError(StatusCodes.NOT_FOUND, info.message));
      }



      const userTokens = await createUserToken(user);

      setAuthCookie(res, userTokens);

      const { password, ...rest } = user;

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User logged in successfully",
        data: {
          accesToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
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

// Handling google authentiction "/Google/callback" route
const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirect = req.query.state as string;
    if (redirect.startsWith("/")) {
      redirect = redirect.slice(1);
    }
    const user = req.user;
    if (!user) {
      throw new appError(StatusCodes.NOT_FOUND, "User not found");
    }
    const userTokens = await createUserToken(user);
    // await setAuthCookie(res, userTokens)
    console.log(`frontendUtl: ${envVars.FRONEND_URL}`);

    res.redirect(`${envVars.FRONEND_URL as string}/${redirect}`);
  }
);

// chaning user password based on user token in case of while user need to chnage password
const chnagePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body;
    const decodedToken = req.user;

    const data = await authServices.chnagePassword(
      newPassword,
      oldPassword,
      decodedToken as JwtPayload
    );
    if (!data) {
      throw new appError(
        StatusCodes.BAD_REQUEST,
        "Changing password is failed"
      );
    }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password successfully chnaged",
      data: null,
    });
  }
);

// setting user password while user register via google
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

// resetting user password via reset password link
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    console.log("In auth controller decodedToken:", decodedToken);
    const data = await authServices.resetPassword(
      req.body,
      decodedToken as JwtPayload
    );

    if (!data) {
      throw new appError(
        StatusCodes.BAD_REQUEST,
        "new pass and old pass not found"
      );
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password successfully reset",
      data: null,
    });
  }
);

// Sending forget password link to email to chnage user password
const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    const data = await authServices.forgotPassword(email);
    if (!data) {
      throw new appError(
        StatusCodes.BAD_REQUEST,
        "Failed to send password reset link"
      );
    }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password reset link sent to user email",
      data: null,
    });
  }
);

export const authController = {
  credentialsLogin,
  getNewAccessToken,
  logoutUser,
  googleCallback,
  chnagePassword,
  setPassword,
  forgotPassword,
  resetPassword,
};
