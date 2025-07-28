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
    // eslint-disable-next-line no-console
    console.log(`Got reqest in checkauth - req.body: `, req.body);
    
    try {
      const accessToken = req.headers.authorization;
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

      if (userExist.isDeleted === true) {
        throw new appError(StatusCodes.BAD_REQUEST, `User is deleted already`);
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
