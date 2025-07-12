import { NextFunction, Request, Response } from "express";
import appError from "../errorHelper/appError";
import { StatusCodes } from "http-status-codes";
import { verifyJwtToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken)
        throw new appError(StatusCodes.BAD_REQUEST, "Acces token not found");

      // const verifiedToekn = jwt.verify(
      //   accessToken,
      //   "OwnSecretSignatureForJWT"
      // ) as JwtPayload;
      const verifiedToekn = verifyJwtToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET as string
      ) as JwtPayload;
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