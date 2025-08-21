"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodValidation = exports.createZodValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createZodValidation = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "name must be a string" })
        .min(3, { message: "name must be at least three character" })
        .max(50, { message: "name should contain maximum 50 chacacter" }),
    email: zod_1.default
        .string({ invalid_type_error: "Invalid email address formate" })
        .min(5, { message: "email should be at least 5 character" })
        .max(50, { message: "email should contain maximum 50 chacacter" })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: zod_1.default
        .string({ invalid_type_error: "Invalid password type" })
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\\/-]).{8,}$/, "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character"),
    phone: zod_1.default
        .string({ invalid_type_error: "Invalid phone type" })
        .regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, "Invalid Bangladeshi phone number format")
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Invalid address type" })
        .max(200, { message: "Addres must no more than 200 character" })
        .optional(),
});
exports.updateUserZodValidation = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "name must be a string" })
        .min(3, { message: "name must be at least three character" })
        .max(50, { message: "name should contain maximum 50 chacacter" }).optional(),
    phone: zod_1.default
        .string({ invalid_type_error: "Invalid phone type" })
        .regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, "Invalid Bangladeshi phone number format")
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Invalid address type" })
        .max(200, { message: "Addres must no more than 200 character" })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.role)).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.isActive)).optional(),
    isDeleted: zod_1.default.boolean({ invalid_type_error: "isDeleted must a boolean" }).optional(),
    isVerified: zod_1.default.boolean({ invalid_type_error: "isVerified must a boolean" }).optional(),
});
