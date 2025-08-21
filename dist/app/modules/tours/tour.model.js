"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.tourModel = exports.tourTypeModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const tourTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});
exports.tourTypeModel = mongoose_1.default.model("TourTypes", tourTypeSchema);
const tourSchema = new mongoose_1.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    location: { type: String },
    description: { type: String },
    costForm: { type: Number },
    images: { type: [String], default: [] },
    startDate: { type: Date },
    endDate: { type: Date },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Division",
        required: true,
    },
    tourType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TourTypes",
        required: true,
    },
}, {
    timestamps: true,
});
// Pre hook for adding Tour slug at the end of slug while creating tour
tourSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let modifiedSlug = `${this.title}`
            .split(" ")
            .join("-")
            .toLocaleLowerCase()
            .split(" ")
            .join("-")
            .toLocaleLowerCase();
        let counter = 0;
        while (yield exports.tourModel.exists({ slug: modifiedSlug })) {
            modifiedSlug = `${modifiedSlug}-${counter++}`;
        }
        this.slug = modifiedSlug;
        next();
    });
});
// Pre hook for adding Tour slug at the end of slug while updating tour
tourSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tour = this.getUpdate();
        if (tour.title) {
            let modifiedSlug = `${tour.title}`
                .split(" ")
                .join("-")
                .split(" ")
                .join("-")
                .toLocaleLowerCase();
            let counter = 1;
            while (yield exports.tourModel.exists({ slug: modifiedSlug })) {
                modifiedSlug = `${modifiedSlug}-${counter++}`;
            }
            tour.slug = modifiedSlug;
            this.setUpdate(tour);
        }
        if (tour.slug) {
            let modifiedSlug = `${tour.slug}`
                .split(" ")
                .join("-")
                .split(" ")
                .join("-")
                .toLocaleLowerCase();
            let counter = 1;
            while (yield exports.tourModel.exists({ slug: modifiedSlug })) {
                modifiedSlug = `${modifiedSlug}-${counter++}`;
            }
            tour.slug = modifiedSlug;
            this.setUpdate(tour);
        }
        next();
    });
});
exports.tourModel = mongoose_1.default.model("Tour", tourSchema);
