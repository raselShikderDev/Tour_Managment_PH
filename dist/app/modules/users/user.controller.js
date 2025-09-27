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
exports.userCcontroller = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_services_1 = require("./user.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = __importDefault(require("../../errorHelper/appError"));
// Getting all user using custom async handleer - Which decrese using tryCatch repeatedly
const getAllUsers = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.userServices.getAllUser();
    // res.status(StatusCodes.CREATED).json({
    //   success: true,
    //   message: "User created",
    //   allUser,
    // });
    // Sending success Response using custom response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All users retrived successfully",
        data: result.data,
        meta: {
            total: result.meta
        },
    });
}));
// Creating a user using custom async handleer - Which decrese using tryCatch repeatedly
const createUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield user_services_1.userServices.createUser(req.body);
    // if (Object.keys(newUser).length === 0) {
    //   res.status(StatusCodes.BAD_GATEWAY).json({
    //     success: false,
    //     message: "Faild to create User",
    //   });
    // }
    // res.status(StatusCodes.CREATED).json({
    //   success: true,
    //   message: "User created",
    //   newUser,
    // });
    // Sending success Response using custom response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "User created successfully",
        data: {
            email: newUser.email
        },
    });
}));
// // Creating controller in a traditional way with usign again and again try catch
// const createUser = async (req: Request, res: Response, next:NextFunction) => {
//   try {
//     // throw new appError(StatusCodes.BAD_REQUEST, "Fake Error by appError");
//     const newUser = await userServices.createUser(req.body)
// if (Object.keys(newUser).length === 0) {
//   res.status(StatusCodes.BAD_GATEWAY).json({
//     success: false,
//     message: "Faild to create User",
//   });
// }
// res.status(StatusCodes.CREATED).json({
//   success: true,
//   message: "User created",
//   newUser,
// });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     // res.status(StatusCodes.BAD_REQUEST).json({
//     //   success: false,
//     //   message: `User creataion faild: ${error.message}`,
//     //   error,
//     // });
//     next(error)
//   }
// };
/**
 * Deleting user
 */
const deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User id is not valid");
    }
    const deletedUser = yield user_services_1.userServices.deleteuser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
    });
}));
// Retriveve singel a user
const getSingelUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.userId;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User id is not valid");
    }
    const user = yield user_services_1.userServices.getSingelUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully retrived a user",
        data: user,
    });
}));
// Retriveve current user data
const getMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    // eslint-disable-next-line no-console
    console.log("Got request");
    const user = yield user_services_1.userServices.getSingelUser(decodedToken.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully retrived current user profile",
        data: user,
    });
}));
// Updating user info
const updateUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User id is not valid");
    }
    const payload = req.body;
    // const token = req.headers.authorization
    // const verifiedToken = verifyJwtToken(token as string, envVars.JWT_ACCESS_SECRET as string) as JwtPayload
    // setting token in request by decalring a type for request that getting from express
    const verifiedToken = req.user;
    const updatedUserInfo = yield user_services_1.userServices.updateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User updated successfully",
        data: updatedUserInfo,
    });
}));
exports.userCcontroller = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getSingelUser,
    getMe,
};
