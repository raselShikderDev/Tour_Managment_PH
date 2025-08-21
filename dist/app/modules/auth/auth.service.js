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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const user_interface_1 = require("../users/user.interface");
const user_model_1 = require("../users/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
// import bcryptjs from "bcryptjs";
const userTokens_1 = require("../../utils/userTokens");
const newAccessTokenWithrefreshToken_1 = require("../../utils/newAccessTokenWithrefreshToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const sendEmail_1 = require("../../utils/sendEmail");
// checking credential login info and creating user tokens
const credentialsLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const existedUser = yield user_model_1.userModel.findOne({ email });
    if (!existedUser)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not exist");
    if (existedUser.isActive === user_interface_1.isActive.INACTIVE ||
        existedUser.isActive === user_interface_1.isActive.BLOCKED) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, `User is ${existedUser.isActive}`);
    }
    if (existedUser.isDeleted === true) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, `User is deleted already`);
    }
    const isLoggedIn = yield bcrypt_1.default.compare(password, existedUser.password);
    console.log(`passMatch in auth login: ${isLoggedIn}`);
    if (!isLoggedIn) {
        console.log(`In not valid password block`);
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid Password");
    }
    if (existedUser.isVerified === false) {
        console.log(`in User is not veified Block`);
        throw new appError_1.default(401, "User is not verified");
    }
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
    const userTokens = yield (0, userTokens_1.createUserToken)(existedUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass } = existedUser, rest = __rest(existedUser, ["password"]);
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
    };
});
// Creating new token using refresh token
const newAccessToken = (refreshToen) => __awaiter(void 0, void 0, void 0, function* () {
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
    const userTokens = yield (0, newAccessTokenWithrefreshToken_1.createNewAccessTokenWithrefreshToken)(refreshToen);
    return {
        accessToken: userTokens,
    };
});
// chaning user password based on user token in case of while user need to chnage password
const chnagePassword = (newPassword, oldPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findById(decodedToken.userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Incorrect Password");
    }
    user.password = yield bcrypt_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    yield user.save();
    return true;
});
// setting user password while user register via google
const setPassword = (decodedToken, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findById(decodedToken.id);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.password &&
        user.auths.some((authprovider) => authprovider.provider == "google")) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You have already set your password. Now you can chnage your password");
    }
    const hashedpassword = yield bcrypt_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const credentialsProvider = {
        provider: "Credentials",
        providerId: user.email,
    };
    const auth = [...user.auths, credentialsProvider];
    user.password = hashedpassword;
    user.auths = auth;
    yield user.save();
    return {};
});
// Sending forget password link to email to chnage user password
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existedUser = yield user_model_1.userModel.findOne({ email });
    if (!existedUser) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not exist");
    }
    if (existedUser.isVerified === false) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "User is not verified");
    }
    if (existedUser.isActive === user_interface_1.isActive.INACTIVE ||
        existedUser.isActive === user_interface_1.isActive.BLOCKED) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, `User is ${existedUser.isActive}`);
    }
    if (existedUser.isDeleted === true) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, `User is deleted already`);
    }
    const jwtPayload = {
        user: existedUser._id,
        email: existedUser.email,
        role: existedUser.role,
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: "5m",
    });
    const resetUiLink = `${env_1.envVars.FRONEND_URL}/forgot-password?id=${existedUser._id}&resetToken=${resetToken}`;
    yield (0, sendEmail_1.sendEmail)({
        to: existedUser.email,
        subject: "Password reset",
        templateName: "forgetPassword",
        templateData: {
            name: existedUser.name,
            resetUiLink,
        },
    });
    return true;
});
// resetting user password via reset password link
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id != decodedToken.user) {
        throw new appError_1.default(401, "You can not reset your password");
    }
    const isUserExist = yield user_model_1.userModel.findById(decodedToken.user);
    if (!isUserExist) {
        throw new appError_1.default(401, "User does not exist");
    }
    isUserExist.password = yield bcrypt_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    yield isUserExist.save();
    return true;
});
//user - login - token (email, role, _id) - booking / payment / booking / payment cancel - token
exports.authServices = {
    credentialsLogin,
    newAccessToken,
    chnagePassword,
    setPassword,
    forgotPassword,
    resetPassword,
};
