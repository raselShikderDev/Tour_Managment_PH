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
exports.tourController = exports.tourTypeController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const tour_services_1 = require("./tour.services");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const mongoose_1 = __importDefault(require("mongoose"));
/**--------------------------- Tour types Controller -------------------------- */
//Creating tourType
const createTourType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const newTourType = yield tour_services_1.tourTypeServices.createTourType(payload);
    if (!newTourType) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, "Somthing went wrong");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "TourType successfully created ",
        data: newTourType,
    });
}));
//Retriving all TourType
const getAllTourType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allTourType = yield tour_services_1.tourTypeServices.getAllTourType();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully retrived TourType",
        data: allTourType,
    });
}));
//Retriving all TourType
const getSingelTourType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "TourType id is not valid");
    }
    const TourType = yield tour_services_1.tourTypeServices.getSingelTourType(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully retrived TourType",
        data: TourType,
    });
}));
// Deleteing a TourType
const deleteTourType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "TourType id is not valid");
    }
    yield tour_services_1.tourTypeServices.deleteTourType(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully deleted a tourType",
        data: null,
    });
}));
// Updating a TourType
const updateTourType = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "TourType id is not valid");
    }
    const payload = req.body;
    const updatedNewdTourType = yield tour_services_1.tourTypeServices.updateTourType(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully updated a TourType",
        data: updatedNewdTourType,
    });
}));
exports.tourTypeController = {
    createTourType,
    getAllTourType,
    deleteTourType,
    updateTourType,
    getSingelTourType,
};
/**------------------------------ Tour Controller -------------------------------- */
//Creating tour
const createTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map((file) => file.path) });
    const newTour = yield tour_services_1.tourServices.createTour(payload);
    if (!newTour) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, "Somthing went wrong");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Tour successfully created ",
        data: newTour,
    });
}));
// get singel tour by slug
const getSingelTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const singelTour = yield tour_services_1.tourServices.getSingelTour(slug);
    if (Object.values(singelTour).length === 0) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tour id is not valid");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully retrived a tour",
        data: singelTour,
    });
}));
//Retriving all Tour
const getAllTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const allTour = yield tour_services_1.tourServices.getAllTour(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully retrived Tours",
        data: allTour,
    });
}));
// Deleteing a Tour
const deleteTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tour id is not valid");
    }
    yield tour_services_1.tourServices.deleteTour(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully deleted a tour",
        data: null,
    });
}));
// Updating a Tour
const updateTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Tour id is not valid");
    }
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map((file) => file.path) });
    const updatedNewdTour = yield tour_services_1.tourServices.updateTour(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Successfully updated a Tour",
        data: updatedNewdTour,
    });
}));
exports.tourController = {
    createTour,
    getAllTour,
    deleteTour,
    updateTour,
    getSingelTour,
};
