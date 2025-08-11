/* eslint-disable no-console */
import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import { userModel } from "../users/user.model";
import appError from "../../errorHelper/appError";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/env";

const otpExpiration = 2 * 60; // 2 min

const generateOtp = (leanth = 6) => {
  const otp = crypto.randomInt(10 ** (leanth - 1), 10 ** leanth).toString();
  return otp;
};

// send otp to user`
const otpSend = async (email: string) => {
  console.log(`In service Request recived for send otp to: ${email}`);
  
  const existedUser = await userModel.findOne({ email });
  console.log(`Existed user: ${existedUser}`);
  
  if (!existedUser) {
    throw new appError(StatusCodes.NOT_FOUND, "User not exist");
  }
  if (existedUser.isVerified === true) {
    throw new appError(StatusCodes.FORBIDDEN, "You already verified");
  }

  const otp = generateOtp();
  const rediskey = `otp:${email}`;

  // storing otp in redis for 2 min
  try {
    await redisClient.set(rediskey, otp, {
      expiration: {
        type: "EX",
        value: otpExpiration,
      },
    });
    if (envVars.NODE_ENV === "Development") console.log("set otp to redis");
  } catch (error) {
    if (envVars.NODE_ENV === "Development") console.error("Redis set error:", error);
    throw error;
  }

//  sending otp to user email
  try {
    await sendEmail({
      to: email,
      subject: "Verify OTP Code",
      templateName: "otp",
      templateData: {
        name:existedUser.name,
        otp,
      },
    });
    if (envVars.NODE_ENV === "Development") console.log("send email of otp");
  } catch (error) {
    if (envVars.NODE_ENV === "Development")
      console.error("sendind email error in otp service:", error);
    throw error;
  }
};

// verifying user otp
const verifyOtp = async (email: string, otp: string) => {
  const existedUser = await userModel.findOne({ email });
  if (!existedUser) {
    throw new appError(StatusCodes.NOT_FOUND, "User not exist");
  }

  const rediskey = `otp:${email}`;
  const DatabaseOtp = await redisClient.get(rediskey)

  if(!DatabaseOtp){
    throw new appError(StatusCodes.UNAUTHORIZED, "Invalid OTP");
  }

  if(DatabaseOtp != otp){
    throw new appError(StatusCodes.UNAUTHORIZED, "Invalid OTP");
  }

  await Promise.all([
    userModel.findByIdAndUpdate(existedUser._id, {isVerified:true}, {runValidators:true}),
    redisClient.del(rediskey)
  ])
  
};

export const otpServices = {
  otpSend,
  verifyOtp,
};
