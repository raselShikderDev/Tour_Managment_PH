import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { IUser } from "../users/user.interface";
import { userModel } from "../users/user.model";
import bcrypt from "bcrypt";
import { createUserToken } from "../../utils/userTokens";
import { createNewAccessTokenWithrefreshToken } from "../../utils/newAccessTokenWithrefreshToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

// checking credential login info and creating user tokens
const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const existedUser = await userModel.findOne({ email });

  if (!existedUser) throw new appError(StatusCodes.NOT_FOUND, "User not exist");

  const isLoggedIn = await bcrypt.compare(
    password as string,
    existedUser.password as string
  );
  if (!isLoggedIn)
    throw new appError(StatusCodes.BAD_REQUEST, "Invalid Password");

  // const jwtPayload = {
  //   email: existedUser.email,
  //   name: existedUser.name,
  //   role: existedUser.role,
  // };
  // // // generating token in traditional way
  // // const accessToken = jwt.sign(jwtPayload, "OwnSecretSignatureForJWT", {expiresIn: "1d"})

  // // generating token by utils function
  // const accessToken = await GenerateAccessToken(
  //   jwtPayload,
  //   envVars.JWT_ACCESS_SECRET as string,
  //   envVars.JWT_ACCESS_EXPIRES as string
  // );

  // // generating refresh token by utils function
  // const refreshToken = await GenerateAccessToken(
  //   jwtPayload,
  //   envVars.JWT_REFRESH_SECRET as string,
  //   envVars.JWT_REFRESH_EXPIRES as string
  // );

  // Generating accesstoken and refreshToen in singel utils function
  const userTokens = await createUserToken(existedUser);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = existedUser;

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

// Creating new token using refresh token
const newAccessToken = async (refreshToen: string) => {
  //  const verifyRefreshToken = await verifyJwtToken(refreshToen, envVars.JWT_REFRESH_SECRET as string) as JwtPayload

  //   const existedUser = await userModel.findOne({ email:verifyRefreshToken.email });

  //   if(!existedUser){
  //     throw new appError(StatusCodes.NOT_FOUND, "User not exist");
  //   }

  //  if (existedUser.isDeleted === true) {
  //   throw new appError(StatusCodes.BAD_REQUEST, `User is deleted already`);
  // }

  // if (existedUser.isActive === isActive.INACTIVE || existedUser.isActive === isActive.BLOCKED) {
  //   throw new appError(StatusCodes.BAD_REQUEST, `User is ${existedUser.isActive}`);
  // }

  //   // Generating accesstoken and refreshToen in singel utils function
  //   const userTokens = await createUserToken(existedUser)

  // creating new access token with refresh token in utils function
  const userTokens = await createNewAccessTokenWithrefreshToken(refreshToen);

  return {
    accessToken: userTokens,
  };
};

// Reseting user password based on usertoken
const resetPassword = async (
  newPassword: string,
  oldPassword: string,
  decodedToken: JwtPayload
) => {

  const user = await userModel.findById(decodedToken.userId);
  if (!user) {
    throw new appError(StatusCodes.NOT_FOUND, "User not found");
  }
  const isPasswordMatch = await bcrypt.compare(
    oldPassword,
    user.password as string
  );
  if (!isPasswordMatch) {
    throw new appError(StatusCodes.UNAUTHORIZED, "Incorrect Password");
  }

  user.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user.save();
};
export const authServices = {
  credentialsLogin,
  newAccessToken,
  resetPassword,
};
