"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpServices = void 0;
/* eslint-disable no-console */
const crypto_1 = __importDefault(require("crypto"));
const redis_config_1 = require("../../config/redis.config");
const sendEmail_1 = require("../../utils/sendEmail");
const user_model_1 = require("../users/user.model");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const http_status_codes_1 = require("http-status-codes");
const env_1 = require("../../config/env");
const otpExpiration = 2 * 60; // 2 min
const generateOtp = (leanth = 6) => {
    const otp = crypto_1.default.randomInt(10 ** (leanth - 1), 10 ** leanth).toString();
    return otp;
};
// send otp to user`
const otpSend = (email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`In service Request recived for send otp to: ${email}`);
    const existedUser = yield user_model_1.userModel.findOne({ email });
    console.log(`Existed user: ${existedUser}`);
    if (!existedUser) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not exist");
    }
    if (existedUser.isVerified === true) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You already verified");
    }
    const otp = generateOtp();
    const rediskey = `otp:${email}`;
    // storing otp in redis for 2 min
    try {
        yield redis_config_1.redisClient.set(rediskey, otp, {
            expiration: {
                type: "EX",
                value: otpExpiration,
            },
        });
        if (env_1.envVars.NODE_ENV === "Development")
            console.log("set otp to redis");
    }
    catch (error) {
        if (env_1.envVars.NODE_ENV === "Development")
            console.error("Redis set error:", error);
        throw error;
    }
    //  sending otp to user email
    try {
        yield (0, sendEmail_1.sendEmail)({
            to: email,
            subject: "Verify OTP Code",
            templateName: "otp",
            templateData: {
                name: existedUser.name,
                otp,
            },
        });
        if (env_1.envVars.NODE_ENV === "Development")
            console.log("send email of otp");
    }
    catch (error) {
        if (env_1.envVars.NODE_ENV === "Development")
            console.error("sendind email error in otp service:", error);
        throw error;
    }
});
// verifying user otp
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const existedUser = yield user_model_1.userModel.findOne({ email });
    if (!existedUser) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not exist");
    }
    const rediskey = `otp:${email}`;
    const DatabaseOtp = yield redis_config_1.redisClient.get(rediskey);
    if (!DatabaseOtp) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid OTP");
    }
    if (DatabaseOtp != otp) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid OTP");
    }
    yield Promise.all([
        user_model_1.userModel.findByIdAndUpdate(existedUser._id, { isVerified: true }, { runValidators: true }),
        redis_config_1.redisClient.del(rediskey)
    ]);
});
exports.otpServices = {
    otpSend,
    verifyOtp,
};
