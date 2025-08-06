import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { verifyJwtToken } from "./jwt";
import { userModel } from "../modules/users/user.model";
import appError from "../errorHelper/appError";
import { StatusCodes } from "http-status-codes";
import { isActive } from "../modules/users/user.interface";
import { createUserToken } from "./userTokens";

export const createNewAccessTokenWithrefreshToken = async(refreshToen:string) => {
  const verifyRefreshToken = await verifyJwtToken(refreshToen, envVars.JWT_REFRESH_SECRET as string) as JwtPayload

  const existedUser = await userModel.findOne({ email:verifyRefreshToken.email });

  if(!existedUser){
    throw new appError(StatusCodes.NOT_FOUND, "User not exist");
  }

   if (existedUser.isDeleted === true) {
    throw new appError(StatusCodes.BAD_REQUEST, `User is deleted already`);
  }

  if (existedUser.isActive === isActive.INACTIVE || existedUser.isActive === isActive.BLOCKED) {
    throw new appError(StatusCodes.BAD_REQUEST, `User is ${existedUser.isActive}`);
  }

 
  // Generating accesstoken and refreshToen in singel utils function
  const userTokens = await createUserToken(existedUser) 

  return userTokens.accessToken
}

