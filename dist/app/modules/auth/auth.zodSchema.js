"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordZodSchema = exports.forgotPasswordZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.forgotPasswordZodSchema = zod_1.default.object({
    email: zod_1.default
        .string({ invalid_type_error: "Invalid email address formate" })
        .min(5, { message: "email should be at least 5 character" })
        .max(50, { message: "email should contain maximum 50 chacacter" })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});
exports.resetPasswordZodSchema = zod_1.default.object({
    newPassword: zod_1.default
        .string({ invalid_type_error: "Invalid password type" })
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\\/-]).{8,}$/, "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character"),
    id: zod_1.default.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ObjectId'),
});
