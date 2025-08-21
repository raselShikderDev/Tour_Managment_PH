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
exports.createNewAccessTokenWithrefreshToken = void 0;
const env_1 = require("../config/env");
const jwt_1 = require("./jwt");
const user_model_1 = require("../modules/users/user.model");
const appError_1 = __importDefault(require("../errorHelper/appError"));
const http_status_codes_1 = require("http-status-codes");
const user_interface_1 = require("../modules/users/user.interface");
const userTokens_1 = require("./userTokens");
const createNewAccessTokenWithrefreshToken = (refreshToen) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyRefreshToken = yield (0, jwt_1.verifyJwtToken)(refreshToen, env_1.envVars.JWT_REFRESH_SECRET);
    const existedUser = yield user_model_1.userModel.findOne({ email: verifyRefreshToken.email });
    if (!existedUser) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not exist");
    }
    if (existedUser.isDeleted === true) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `User is deleted already`);
    }
    if (existedUser.isActive === user_interface_1.isActive.INACTIVE || existedUser.isActive === user_interface_1.isActive.BLOCKED) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `User is ${existedUser.isActive}`);
    }
    // Generating accesstoken and refreshToen in singel utils function
    const userTokens = yield (0, userTokens_1.createUserToken)(existedUser);
    return userTokens.accessToken;
});
exports.createNewAccessTokenWithrefreshToken = createNewAccessTokenWithrefreshToken;
