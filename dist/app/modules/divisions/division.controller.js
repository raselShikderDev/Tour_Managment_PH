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
exports.divisionController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const divison_services_1 = require("./divison.services");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const env_1 = require("../../config/env");
const mongoose_1 = __importDefault(require("mongoose"));
// Creating divisions
const CreateDivision = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const division = yield divison_services_1.divisionServices.createDivision(payload);
    if (!division)
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, "Somthing went wrong");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Divison successfully created ",
        data: division,
    });
}));
// Get a singel Division\
const getSingelDivision = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const singelDivision = yield divison_services_1.divisionServices.getSingelDivision(slug);
    if (Object.values(singelDivision).length === 0) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tour id is not valid");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully retrived a division",
        data: singelDivision,
    });
}));
// Retriving all divions
const getAllDivisions = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allDivisons = yield divison_services_1.divisionServices.getAllDivisions();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully retrived Divisons",
        data: allDivisons,
    });
}));
// Deleting a divion
const deleteDivision = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Division id is not valid");
    }
    const deletedDivision = yield divison_services_1.divisionServices.deleteDivision(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully deleted a Divisons",
        data: env_1.envVars.NODE_ENV === "Development" ? deletedDivision : null,
    });
}));
// Updating a divion
const updateDivision = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Division id is not valid");
    }
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const updatedNewdDivision = yield divison_services_1.divisionServices.updateDivision(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully updated a Divison",
        data: updatedNewdDivision,
    });
}));
exports.divisionController = {
    CreateDivision,
    getAllDivisions,
    deleteDivision,
    updateDivision,
    getSingelDivision,
};
