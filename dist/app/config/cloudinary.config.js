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
exports.cloudinaryUpload = exports.deleteImageFromCloudinary = exports.uploadBufferCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
const appError_1 = __importDefault(require("../errorHelper/appError"));
const http_status_codes_1 = require("http-status-codes");
const stream_1 = __importDefault(require("stream"));
cloudinary_1.v2.config({
    api_secreet: env_1.envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
    api_key: env_1.envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    cloude_name: env_1.envVars.CLOUDINARY.CLOUDINARY_NAME,
});
// Uploading Buffer in cloudinary
const uploadBufferCloudinary = (buffer, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const public_id = `pdf/${fileName}-${Date.now()}`;
            const bufferStream = new stream_1.default.PassThrough();
            bufferStream.end(buffer);
            cloudinary_1.v2.uploader
                .upload_stream({
                resource_type: "auto",
                public_id,
                folder: "pdf",
            }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            })
                .end(buffer);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Faild to upload file:${error.message}`);
        }
    });
});
exports.uploadBufferCloudinary = uploadBufferCloudinary;
// Deleting image from cloudinary
const deleteImageFromCloudinary = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //https://res.cloudinary.com/dhht37fgc/image/upload/v1753497516/y2fb23kzi2r-1753497515497-forest-jpg-.jpg.jpg
        const regex = /v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        if (match && match[1]) {
            const public_id = match[1];
            yield cloudinary_1.v2.uploader.destroy(public_id);
            // eslint-disable-next-line no-console
            console.log("File ", +public_id + " Removed from the cloudinary");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Faild to delete image in cloudinary", error.message);
    }
});
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
exports.cloudinaryUpload = cloudinary_1.v2;
