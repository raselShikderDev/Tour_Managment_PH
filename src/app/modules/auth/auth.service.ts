/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { StatusCodes } from "http-status-codes";
import appError from "../../errorHelper/appError";
import { IAuthProvider, isActive, IUser } from "../users/user.interface";
import { userModel } from "../users/user.model";
import bcrypt from "bcrypt";
// import bcryptjs from "bcryptjs";
import { createUserToken } from "../../utils/userTokens";
import { createNewAccessTokenWithrefreshToken } from "../../utils/newAccessTokenWithrefreshToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";

// checking credential login info and creating user tokens
const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const existedUser = await userModel.findOne({ email });

  if (!existedUser) throw new appError(StatusCodes.NOT_FOUND, "User not exist");
  if (existedUser.isVerified === false) {
    throw new appError(401, "User is not verified");
  }

  if (
    existedUser.isActive === isActive.INACTIVE ||
    existedUser.isActive === isActive.BLOCKED
  ) {
    throw new appError(
      StatusCodes.UNAUTHORIZED,
      `User is ${existedUser.isActive}`
    );
  }

  if (existedUser.isDeleted === true) {
    throw new appError(StatusCodes.UNAUTHORIZED, `User is deleted already`);
  }
  const isLoggedIn = await bcrypt.compare(
    password as string,
    existedUser.password as string
  );
  console.log(`passMatch in auth login: ${isLoggedIn}`);
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

// chaning user password based on user token in case of while user need to chnage password
const chnagePassword = async (
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
  await user.save();
  return true;
};

// setting user password while user register via google
const setPassword = async (decodedToken: JwtPayload, plainPassword: string) => {
  const user = await userModel.findById(decodedToken.id);
  if (!user) {
    throw new appError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (
    user.password &&
    user.auths.some((authprovider) => authprovider.provider == "google")
  ) {
    throw new appError(
      StatusCodes.BAD_REQUEST,
      "You have already set your password. Now you can chnage your password"
    );
  }

  const hashedpassword = await bcrypt.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND as string)
  );

  const credentialsProvider: IAuthProvider = {
    provider: "Credentials",
    providerId: user.email,
  };

  const auth: IAuthProvider[] = [...user.auths, credentialsProvider];

  user.password = hashedpassword;
  user.auths = auth;
  await user.save();

  return {};
};

// Sending forget password link to email to chnage user password
const forgotPassword = async (email: string) => {
  const existedUser = await userModel.findOne({ email });
  if (!existedUser) {
    throw new appError(StatusCodes.NOT_FOUND, "User not exist");
  }
  if (existedUser.isVerified === false) {
    throw new appError(StatusCodes.FORBIDDEN, "User is not verified");
  }

  if (
    existedUser.isActive === isActive.INACTIVE ||
    existedUser.isActive === isActive.BLOCKED
  ) {
    throw new appError(
      StatusCodes.UNAUTHORIZED,
      `User is ${existedUser.isActive}`
    );
  }

  if (existedUser.isDeleted === true) {
    throw new appError(StatusCodes.UNAUTHORIZED, `User is deleted already`);
  }

  const jwtPayload = {
    user: existedUser._id,
    email: existedUser.email,
    role: existedUser.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET as string, {
    expiresIn: "5m",
  });
  const resetUiLink = `${envVars.FRONEND_URL}/forgot-password?id=${existedUser._id}&resetToken=${resetToken}`;

  await sendEmail({
    to: existedUser.email,
    subject: "Password reset",
    templateName: "forgetPassword",
    templateData: {
      name: existedUser.name,
      resetUiLink,
    },
  });
  return true;
};

// resetting user password via reset password link
const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id != decodedToken.user) {
    throw new appError(401, "You can not reset your password");
  }

  const isUserExist = await userModel.findById(decodedToken.user);
  if (!isUserExist) {
    throw new appError(401, "User does not exist");
  }

  isUserExist.password = await bcrypt.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND as string)
  );

  await isUserExist.save();

  return true;
};

//user - login - token (email, role, _id) - booking / payment / booking / payment cancel - token

export const authServices = {
  credentialsLogin,
  newAccessToken,
  chnagePassword,
  setPassword,
  forgotPassword,
  resetPassword,
};
