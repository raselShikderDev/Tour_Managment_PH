"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodValidation = exports.createDivisionZodValidation = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZodValidation = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "name must be a string" })
        .min(1, { message: "name must be at least one character" }),
    slug: zod_1.default
        .string({ invalid_type_error: "slug must be a string" })
        .min(1, { message: "slug must be at least one character" }),
    thumbnail: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
});
exports.updateDivisionZodValidation = exports.createDivisionZodValidation.partial();
