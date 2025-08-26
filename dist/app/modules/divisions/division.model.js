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
exports.divisionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const divisionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    thumbnail: String,
    description: String,
}, {
    timestamps: true,
});
// Pre hook for adding division at the end of slug while creating 
divisionSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let modifiedSlug = `${this.name}-division`
            .split(" ")
            .join("-")
            .toLocaleLowerCase();
        let counter = 0;
        while (yield exports.divisionModel.exists({ slug: modifiedSlug })) {
            modifiedSlug = `${modifiedSlug}-${counter++}`;
        }
        this.slug = modifiedSlug;
        next();
    });
});
// Pre hook for adding division at the end of slug while updating divisin
divisionSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const division = yield this.getUpdate();
        if (division.name) {
            let modifiedSlug = `${division.name}-division`
                .split(" ")
                .join("-")
                .toLocaleLowerCase();
            let counter = 1;
            while (yield exports.divisionModel.exists({ slug: modifiedSlug })) {
                modifiedSlug = `${modifiedSlug}-${counter++}`;
            }
            division.slug = modifiedSlug;
            this.setUpdate(division);
        }
        if (division.slug) {
            let modifiedSlug = `${division.slug}-division`
                .split(" ")
                .join("-")
                .toLocaleLowerCase();
            let counter = 1;
            while (yield exports.divisionModel.exists({ slug: modifiedSlug })) {
                modifiedSlug = `${modifiedSlug}-${counter++}`;
            }
            division.slug = modifiedSlug;
            this.setUpdate(division);
        }
        next();
    });
});
exports.divisionModel = mongoose_1.default.model("Division", divisionSchema);
