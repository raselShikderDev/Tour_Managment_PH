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
exports.globalError = void 0;
const env_1 = require("../config/env");
const appError_1 = __importDefault(require("../errorHelper/appError"));
const cloudinary_config_1 = require("../config/cloudinary.config");
let errorsSource = [];
const handleCastError = (err) => {
    return {
        statusCode: 400,
        message: "Invalid Mongodb Object Id, Provide a valid id",
    };
};
const handleValidationError = (err) => {
    const errorsSource = [];
    const errors = Object.values(err.errors);
    errors.forEach((errorObject) => {
        errorsSource.push({
            path: errorObject.path,
            message: errorObject.message,
        });
    });
    return {
        statusCode: 400,
        message: `Validation Error`,
        errorsSource,
    };
};
const handleDuplicateError = (err) => {
    const errorsSource = [];
    const matchedArray = err.message.match(/"([^"]*)"/);
    const message = `${matchedArray[1]} already exists`;
    return {
        statusCode: 400,
        message,
        errorsSource,
    };
};
const handleZodError = (err) => {
    const issues = err.issues;
    issues.forEach((issue) => {
        errorsSource.push({
            path: `${issue.path[issue.path.length - 1]} ${issue.code}`,
            message: issue.message,
        });
    });
    return {
        statusCode: 400,
        message: `Zod Error`,
        errorsSource,
    };
};
/**Mongoose error can appear as error
 * 1. cast Error
 * 2. Duplicate error
 * 3. validation error
 */
/** Zod Error can appear as error
 */
const globalError = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let statusCode = 500;
    let message = `Somthing went wrong: ${err.message}`;
    // console.log("err in global: ", err);
    // delete singel image from cludianry - (req.file)
    if (req.file) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(req.file.path);
    }
    // deleting multiple image from cloudinary - (req.files)
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imagesUrl = req.files.map((file) => file.path);
        yield Promise.all(imagesUrl.map((url) => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    // Cast Error / Object id error
    if (err.name === "CastError") {
        const simplifyError = handleCastError(err);
        statusCode = simplifyError.statusCode;
        message = simplifyError.message;
        // console.log("Cast error in global", err);
    }
    // Duplicate Error
    else if (err.code === 1000) {
        const simplifyError = handleDuplicateError(err);
        statusCode = simplifyError.statusCode;
        message = simplifyError.message;
        errorsSource = simplifyError.errorsSource;
    }
    // Mongoose validation error
    else if (err.name === "ValidationError") {
        const simplifyError = handleValidationError(err);
        statusCode = simplifyError.statusCode;
        message = simplifyError.message;
        errorsSource = simplifyError.errorsSource;
    }
    // Zod Error
    else if (err.name === "ZodError") {
        const simplifyError = handleZodError(err);
        statusCode = simplifyError.statusCode;
        message = simplifyError.message;
        errorsSource = simplifyError.errorsSource;
    }
    else if (err instanceof appError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 501;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorsSource,
        err: env_1.envVars.NODE_ENV === "Development" ? err.stack : null,
        stack: env_1.envVars.NODE_ENV === "Development" ? err.stack : null,
    });
});
exports.globalError = globalError;
