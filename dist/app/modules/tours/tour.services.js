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
exports.tourServices = exports.tourTypeServices = void 0;
/* eslint-disable no-console */
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errorHelper/appError"));
const tour_model_1 = require("./tour.model");
const tour_const_varriables_1 = require("./tour.const.varriables");
const queryBuilder_1 = require("../../utils/queryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
/**--------------------------- Tour types Services -------------------------- */
// Creating Tourtype
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tourtypes's infromation not found");
    }
    const newTourtype = yield tour_model_1.tourTypeModel.create(payload);
    return newTourtype;
});
// Retriving all tours
const getAllTourType = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTourType = yield tour_model_1.tourTypeModel.countDocuments();
    const allTourType = yield tour_model_1.tourTypeModel.find().limit(10);
    console.log("No TourType created yet");
    return {
        meta: {
            total: totalTourType,
        },
        data: allTourType,
    };
});
// Get singel a TourType by id
const getSingelTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.tourModel.findById(id);
    if (tourType === null)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tour not found");
    return tourType;
});
// Deleting a TourType
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedATourType = yield tour_model_1.tourTypeModel.findByIdAndDelete(id);
    if (!deleteTourType)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tourtype not found");
    return deletedATourType;
});
// Updating TourType
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "TourType's updated infromation not found");
    const isExist = yield tour_model_1.tourTypeModel.findById(id);
    if (!isExist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "TourType not found");
    }
    const isDuplicate = yield tour_model_1.tourTypeModel.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (isDuplicate !== null) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "A TourType with this title already exists");
    }
    const updatedNewTourType = yield tour_model_1.tourTypeModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!updatedNewTourType)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "TourType not found");
    return updatedNewTourType;
});
exports.tourTypeServices = {
    createTourType,
    getAllTourType,
    deleteTourType,
    updateTourType,
    getSingelTourType,
};
/**------------------------------ Tour Services -------------------------------- */
//Creating tour
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tour's infromation not found");
    }
    // // This part handled by pre hook in model
    // let modifiedSlug = `${payload.title}`.split(" ").join("-").toLocaleLowerCase()
    //   .split(" ")
    //   .join("-")
    //   .toLocaleLowerCase();
    // let counter = 0;
    // while (await tourModel.exists({ slug: modifiedSlug })) {
    //   modifiedSlug = `${modifiedSlug}-${counter++}`;
    // }
    // payload.slug = modifiedSlug;
    const newTour = yield tour_model_1.tourModel.create(payload);
    return newTour;
});
// Get singel a Tour by slug
const getSingelTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.tourModel.findOne({ slug });
    if (tour === null)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tour not found");
    return tour;
});
// Retriving all tours bu query buuilder class
const getAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(tour_model_1.tourModel.find(), query);
    const tours = yield queryBuilder
        .search(tour_const_varriables_1.tourSearchableField)
        .filter()
        .select()
        .sort()
        .pagginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryBuilder.getMeta(),
    ]);
    console.log("data: ", data);
    console.log("meta: ", meta);
    return {
        data,
        meta,
    };
});
// // Retriving all tours Original/ Old raw code
// const getAllTourOld = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchItem = query.searchItem || "";
//   const sort = query.sort || "-createdAt"
//   const field = query.fields ? query.fields.split(",").join(" ") : ""
//   const page = Number(query.page) || 1
//   const limit = Number(query.limit) || 5
//   const skip = (page - 1) * limit
//   for(const field of excludFields){
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field]
//   }
//   const totalTour = await tourModel.countDocuments();
//   const totalPages = Math.ceil(totalTour / limit)
//   const searchQuery = {
//     $or: tourSearchableField.map((field) => ({
//       [field]: { $regex: searchItem, $options: "i" },
//     })),
//   };
//   // const allTours = await tourModel.find(searchQuery).find(filter).sort(sort).select(field).skip(skip).limit(limit);
// const filterQuery = tourModel.find(filter)
// const tours = filterQuery.find(searchQuery)
// const allTours = await tours.sort(sort).select(field).skip(skip).limit(limit);
//   console.log("No Tour created yet");
//   const meta = {
//     pages:totalPages,
//     total:totalTour,
//     limit,
//   }
//   return {
//     meta: meta,
//     data: allTours,
//   };
// };
// Deleting a Tour
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedATour = yield tour_model_1.tourModel.findByIdAndDelete(id);
    if (!deleteTour)
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tour not found");
    return deletedATour;
});
// Updating Tour
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Tour updated request recived: ", payload);
    const existingTour = yield tour_model_1.tourModel.findById(id);
    if (!existingTour) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tour not found");
    }
    const isDuplicate = yield tour_model_1.tourModel.findOne({
        title: payload.title,
        _id: { $ne: id },
    });
    if (isDuplicate !== null) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "A Tour with this title already exists");
    }
    // // This part handled by pre hook in model
    // if (payload.title) {
    //   let modifiedSlug = `${payload.title}`.split(" ").join("-")
    //   .split(" ")
    //   .join("-")
    //   .toLocaleLowerCase();
    // let counter = 0;
    // while (await tourModel.exists({ slug: modifiedSlug })) {
    //   modifiedSlug = `${modifiedSlug}-${counter++}`;
    // }
    // payload.slug = modifiedSlug;
    // }
    // if user want to add image with existing images
    if (payload.images &&
        payload.images.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images];
    }
    // if user want to delete images
    if (payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        const restDBImages = existingTour.images.filter((imgUrl) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imgUrl)); });
        const updatedPayloadImages = (payload.images || [])
            .filter((imageUrl) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter((imageUrl) => !restDBImages.includes(imageUrl));
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }
    const updatedNewTour = yield tour_model_1.tourModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedNewTour) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Tour not found");
    }
    if (payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        yield Promise.all((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.map((url) => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updatedNewTour;
});
exports.tourServices = {
    createTour,
    getAllTour,
    deleteTour,
    updateTour,
    getSingelTour,
};
