import { envVars } from "../config/env";
import { IUser } from "../modules/users/user.interface";
import { GenerateAccessToken } from "./jwt";

export const createUserToken = async (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  // // generating token in traditional way
  // const accessToken = jwt.sign(jwtPayload, "OwnSecretSignatureForJWT", {expiresIn: "1d"})

  // generating token by utils function
  const accessToken = await GenerateAccessToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET as string,
    envVars.JWT_ACCESS_EXPIRES as string
  );

  // generating refresh token by utils function
  const refreshToken = await GenerateAccessToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET as string,
    envVars.JWT_REFRESH_EXPIRES as string
  );
  return {
    accessToken,
    refreshToken,
  };
};
