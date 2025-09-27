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
exports.userServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
// Create a user
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const existsUser = yield user_model_1.userModel.findOne({ email });
    if (existsUser)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User already exists");
    const hashedPasswrd = yield bcrypt_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "Credentials",
        providerId: email,
    };
    const user = yield user_model_1.userModel.create(Object.assign({ email, password: hashedPasswrd, auths: [authProvider] }, rest));
    return user;
});
// Get All user
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const allUser = yield user_model_1.userModel.find({});
    const meta = yield user_model_1.userModel.countDocuments();
    return {
        data: allUser,
        meta: meta,
    };
});
// Get a singel User
const getSingelUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findById(id);
    if (user === null)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    return user;
});
// Update a user
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.role.USER || decodedToken.role === user_interface_1.role.GUIDE) {
        if (decodedToken.userId !== userId) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized to update");
        }
    }
    const userExist = yield user_model_1.userModel.findById(userId);
    if (!userExist)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    if (decodedToken.role === user_interface_1.role.ADMIN && userExist.role === user_interface_1.role.SUPER_ADMIN) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not allowed to update");
    }
    // if user want to change role
    if (payload.role) {
        // If user not admin or super admin
        if (decodedToken.role === user_interface_1.role.USER || decodedToken.role === user_interface_1.role.GUIDE) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized");
        }
        // if user admin but want to promote to super admin - (ONly super admin can promote to super admin)
        if (payload.role === user_interface_1.role.SUPER_ADMIN || decodedToken.role === user_interface_1.role.ADMIN) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isVerified || payload.isDeleted) {
        if (decodedToken.role === user_interface_1.role.USER || decodedToken.role === user_interface_1.role.GUIDE) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized");
        }
    }
    // if (payload.password) {
    //   payload.password = await bcrypt.hash(
    //     payload.password,
    //     Number(envVars.BCRYPT_SALT_ROUND)
    //   );
    // }
    const updateUser = yield user_model_1.userModel.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return updateUser;
});
// Delete a user
const deleteuser = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield user_model_1.userModel.findByIdAndDelete(userid);
    return deletedUser;
});
// Get my profile's information
const getMe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findById(id).select("-password");
    // eslint-disable-next-line no-console
    console.log(user);
    if (user === null)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Your profile's information not found");
    const plainUser = user.toObject();
    return Object.assign(Object.assign({}, plainUser), { password: "" });
});
exports.userServices = {
    createUser,
    getAllUser,
    updateUser,
    deleteuser,
    getSingelUser,
    getMe,
};
