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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserToken = void 0;
const env_1 = require("../config/env");
const jwt_1 = require("./jwt");
const createUserToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    // // generating token in traditional way
    // const accessToken = jwt.sign(jwtPayload, "OwnSecretSignatureForJWT", {expiresIn: "1d"})
    // generating token by utils function
    const accessToken = yield (0, jwt_1.GenerateAccessToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    // generating refresh token by utils function
    const refreshToken = yield (0, jwt_1.GenerateAccessToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
});
exports.createUserToken = createUserToken;
