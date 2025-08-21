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
exports.checkAuth = void 0;
const appError_1 = __importDefault(require("../errorHelper/appError"));
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_model_1 = require("../modules/users/user.model");
const user_interface_1 = require("../modules/users/user.interface");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line no-console
    console.log(`Got reqest in checkauth - req.body: `, req.body);
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken)
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Acces token not found");
        // const verifiedToekn = jwt.verify(
        //   accessToken,
        //   "OwnSecretSignatureForJWT"
        // ) as JwtPayload;
        const verifiedToekn = yield (0, jwt_1.verifyJwtToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        const userExist = yield user_model_1.userModel.findOne({ email: verifiedToekn.email });
        if (!userExist)
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        if (userExist.isVerified === false) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User is not verified");
        }
        if (userExist.isActive === user_interface_1.isActive.INACTIVE ||
            userExist.isActive === user_interface_1.isActive.BLOCKED) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `User is ${userExist.isActive}`);
        }
        if (userExist.isDeleted === true) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `User is deleted already`);
        }
        req.user = verifiedToekn;
        if (!verifiedToekn)
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Token is not valid");
        if (!authRoles.includes(verifiedToekn.role))
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not permitted to view this route");
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
