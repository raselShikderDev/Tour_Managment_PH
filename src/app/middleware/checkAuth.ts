import { NextFunction, Request, Response } from "express";
import appError from "../errorHelper/appError";
import { StatusCodes } from "http-status-codes";
import { verifyJwtToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { userModel } from "../modules/users/user.model";
import { isActive } from "../modules/users/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {    
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;
      if (!accessToken)
        throw new appError(StatusCodes.BAD_REQUEST, "Acces token not found");

      // const verifiedToekn = jwt.verify(
      //   accessToken,
      //   "OwnSecretSignatureForJWT"
      // ) as JwtPayload;
      const verifiedToekn = await verifyJwtToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET as string
      ) as JwtPayload;
      const userExist = await userModel.findOne({ email: verifiedToekn.email });
      if (!userExist)
        throw new appError(StatusCodes.NOT_FOUND, "User not found");

      if(userExist.isVerified === false){
        throw new appError(StatusCodes.NOT_FOUND, "User is not verified");
      }

      if (
        userExist.isActive === isActive.INACTIVE ||
        userExist.isActive === isActive.BLOCKED
      ) {
        throw new appError(
          StatusCodes.BAD_REQUEST,
          `User is ${userExist.isActive}`
        );
      }

      if (userExist.isDeleted === true) {
        throw new appError(StatusCodes.BAD_REQUEST, `User is deleted already`);
      }

      req.user = verifiedToekn;
      if (!verifiedToekn)
        throw new appError(StatusCodes.UNAUTHORIZED, "Token is not valid");

      if (!authRoles.includes(verifiedToekn.role))
        throw new appError(
          StatusCodes.UNAUTHORIZED,
          "You are not permitted to view this route"
        );

      next();
    } catch (error) {
      next(error);
    }
  };
