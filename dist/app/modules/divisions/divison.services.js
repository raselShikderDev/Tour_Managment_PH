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
exports.divisionServices = void 0;
/* eslint-disable no-console */
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const division_model_1 = require("./division.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
// Creating Division
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Division's infromation not found");
    // // This part handled by pre hook in model
    // let modifiedSlug = `${payload.slug}-division`
    //   .split(" ")
    //   .join("-")
    //   .toLocaleLowerCase();
    // let counter = 0;
    // while (await divisionModel.exists({ slug: modifiedSlug})) {
    //   modifiedSlug = `${modifiedSlug}-${counter++}`;
    // }
    // payload.slug = modifiedSlug;
    const division = yield division_model_1.divisionModel.create(payload);
    return division;
});
// Get a singel Division
const getSingelDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.divisionModel.findOne({ slug });
    if (division === null)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Division not found");
    return division;
});
// Getting all divisions
const getAllDivisions = () => __awaiter(void 0, void 0, void 0, function* () {
    const allDivisions = yield division_model_1.divisionModel.find();
    console.log("No Division created yet");
    return allDivisions;
});
// Deleteing a division
const deleteDivision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedDivision = yield division_model_1.divisionModel.findByIdAndDelete(id);
    if (!deletedDivision)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Division not found");
    return deletedDivision;
});
// Updating Division
const updateDivision = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDivision = yield division_model_1.divisionModel.findById(id);
    if (!existingDivision) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Division not found");
    }
    const isDuplicate = yield division_model_1.divisionModel.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (isDuplicate !== null) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "A Division with this name already exists");
    }
    // // This part handled by pre hook in model
    // if (payload.name) {
    //   let modifiedSlug = `${payload.slug}-division`
    //     .split(" ")
    //     .join("-")
    //     .toLocaleLowerCase();
    //   let counter = 0;
    //   while (await divisionModel.exists({ slug: modifiedSlug })) {
    //     modifiedSlug = `${modifiedSlug}-${counter++}`;
    //   }
    //   payload.slug = modifiedSlug;
    // }
    const updatedNewDivision = yield division_model_1.divisionModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!updatedNewDivision) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Division not found");
    }
    if (payload.thumbnail && existingDivision.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(existingDivision.thumbnail);
    }
    return updatedNewDivision;
});
exports.divisionServices = {
    createDivision,
    getAllDivisions,
    deleteDivision,
    updateDivision,
    getSingelDivision,
};
