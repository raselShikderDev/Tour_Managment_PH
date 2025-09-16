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
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const setCookie_1 = require("../../utils/setCookie");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const userTokens_1 = require("../../utils/userTokens");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
// Login by Passport credentials athentication and giving a access token to user API
const credentialsLogin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Recieve losign request in controller", req.body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        // if(err) next(err)
        if (err) {
            console.log(err.message);
            return next(new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, err.message));
        }
        if (!user) {
            if (info.message === "Invalid password") {
                console.log(`In controller - not valid password block`);
                return next(new appError_1.default(500, info.message));
            }
            if (info.message === "User is not verified") {
                console.log(`In controller - in User is not veified block`);
                return next(new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, info.message));
            }
            return next(new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, info.message));
        }
        const userTokens = yield (0, userTokens_1.createUserToken)(user);
        (0, setCookie_1.setAuthCookie)(res, userTokens);
        const { password } = user, rest = __rest(user, ["password"]);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                accesToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest,
            },
        });
    }))(req, res, next);
}));
// // Login by credentials and giving a access token to user API
// const credentialsLogin = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const loggedinInfo = await authServices.credentialsLogin(req.body);
//     //    // Setting access Token and refresh token tradional way
//     //     res.cookie("refreshToken", loggedinInfo.refreshToken, {
//     //         httpOnly:true,
//     //         secure:false
//     //     })
//     //     res.cookie("accessToken", loggedinInfo.accessToken, {
//     //         httpOnly:true,
//     //         secure:false
//     //     })
//     // Setting access Token and refresh token with a utils function
//     setAuthCookie(res, loggedinInfo);
//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: "User logged in successfully",
//       data: loggedinInfo,
//     });
//   }
// );
// Generating new access token by refresh token API
const getNewAccessToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToen = req.cookies.refreshToken;
    const newAccessToen = yield auth_service_1.authServices.newAccessToken(refreshToen);
    (0, setCookie_1.setAuthCookie)(res, newAccessToen);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "New access token retrived successfully",
        data: newAccessToen.accessToken,
    });
}));
// Logout user by deleting accessToken and refreshToken from cookies
const logoutUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User successfully logout",
        data: null,
    });
}));
// Handling google authentiction "/Google/callback" route
const googleCallback = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let redirect = req.query.state;
    if (redirect.startsWith("/")) {
        redirect = redirect.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const userTokens = yield (0, userTokens_1.createUserToken)(user);
    // await setAuthCookie(res, userTokens)
    console.log(`frontendUtl: ${env_1.envVars.FRONEND_URL}`);
    res.redirect(`${env_1.envVars.FRONEND_URL}/${redirect}`);
}));
// chaning user password based on user token in case of while user need to chnage password
const chnagePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body;
    const decodedToken = req.user;
    const data = yield auth_service_1.authServices.chnagePassword(newPassword, oldPassword, decodedToken);
    if (!data) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Changing password is failed");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Password successfully chnaged",
        data: null,
    });
}));
// setting user password while user register via google
const setPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;
    yield auth_service_1.authServices.setPassword(decodedToken, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Password successfully set",
        data: null,
    });
}));
// resetting user password via reset password link
const resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    console.log("In auth controller decodedToken:", decodedToken);
    const data = yield auth_service_1.authServices.resetPassword(req.body, decodedToken);
    if (!data) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "new pass and old pass not found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Password successfully reset",
        data: null,
    });
}));
// Sending forget password link to email to chnage user password
const forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const data = yield auth_service_1.authServices.forgotPassword(email);
    if (!data) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to send password reset link");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Password reset link sent to user email",
        data: null,
    });
}));
exports.authController = {
    credentialsLogin,
    getNewAccessToken,
    logoutUser,
    googleCallback,
    chnagePassword,
    setPassword,
    forgotPassword,
    resetPassword,
};
