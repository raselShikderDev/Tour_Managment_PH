"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpZodSchema = exports.sendOtpZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sendOtpZodSchema = zod_1.default.object({
    email: zod_1.default
        .string({ invalid_type_error: "Invalid email address formate" })
        .min(5, { message: "email should be at least 5 character" })
        .max(50, { message: "email should contain maximum 50 chacacter" })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});
exports.verifyOtpZodSchema = zod_1.default.object({
    email: zod_1.default
        .string({ invalid_type_error: "Invalid email address formate" })
        .min(5, { message: "email should be at least 5 character" })
        .max(50, { message: "email should contain maximum 50 chacacter" })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    otp: zod_1.default
        .string()
        .min(6, { message: "OTP must be exactly 6 digits" })
        .max(6, { message: "OTP must be exactly 6 digits" }),
});
