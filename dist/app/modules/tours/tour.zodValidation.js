"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTourTypeZodSchema = exports.updateTourZodSchema = exports.createTourZodSchema = void 0;
const zod_1 = require("zod");
exports.createTourZodSchema = zod_1.z.object({
    // Required fields
    title: zod_1.z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }).min(1, "Title cannot be empty"),
    tourType: zod_1.z.string({
        required_error: "Tour type is required",
        invalid_type_error: "Tour type must be a string"
    }).min(1, "Tour type cannot be empty"),
    division: zod_1.z.string({
        required_error: "Division is required",
        invalid_type_error: "Division must be a string"
    }).min(1, "Division cannot be empty"),
    // Optional fields
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    costForm: zod_1.z.number({
        invalid_type_error: "Cost must be a number"
    }).optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(), // Match Mongoose schema: images, type Array of String
    startDate: zod_1.z.string().datetime({ message: "Start date must be a valid date string" }).optional(),
    endDate: zod_1.z.string().datetime({ message: "End date must be a valid date string" }).optional(),
    departureLocation: zod_1.z.string().optional(),
    arrivalLocation: zod_1.z.string().optional(),
    included: zod_1.z.array(zod_1.z.string()).optional(),
    excluded: zod_1.z.array(zod_1.z.string()).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    tourPlan: zod_1.z.array(zod_1.z.string()).optional(),
    maxGuest: zod_1.z.number({
        invalid_type_error: "Max guest must be a number"
    }).int("Max guest must be an integer").positive("Max guest must be a positive number").optional(),
    minAge: zod_1.z.number({
        invalid_type_error: "Min age must be a number"
    }).int("Min age must be an integer").positive("Min age must be a positive number").optional(),
});
// Zod schema for updating an existing tour
exports.updateTourZodSchema = zod_1.z.object({
    // All fields are optional for updates
    title: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(), // slug is unique and usually generated, but allowing update here
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    costForm: zod_1.z.number({
        invalid_type_error: "Cost must be a number"
    }).optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(), // Match Mongoose schema: images, type Array of String
    startDate: zod_1.z.string().datetime({ message: "Start date must be a valid date string" }).optional(),
    endDate: zod_1.z.string().datetime({ message: "End date must be a valid date string" }).optional(),
    departureLocation: zod_1.z.string().optional(),
    arrivalLocation: zod_1.z.string().optional(),
    included: zod_1.z.array(zod_1.z.string()).optional(),
    excluded: zod_1.z.array(zod_1.z.string()).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    tourPlan: zod_1.z.array(zod_1.z.string()).optional(),
    maxGuest: zod_1.z.number({
        invalid_type_error: "Max guest must be a number"
    }).int("Max guest must be an integer").positive("Max guest must be a positive number").optional(),
    minAge: zod_1.z.number({
        invalid_type_error: "Min age must be a number"
    }).int("Min age must be an integer").positive("Min age must be a positive number").optional(),
    tourType: zod_1.z.string().optional(),
    division: zod_1.z.string().optional(),
    deleteImages: zod_1.z.array(zod_1.z.string()).optional()
});
exports.createTourTypeZodSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
// export const createTourZodSchema = z.object({
//     title: z.string(),
//     description: z.string().optional(),
//     location: z.string().optional(),
//     costFrom: z.number().optional(),
//     startDate: z.string().optional().optional(),
//     endDate: z.string().optional().optional(),
//     tourType: z.string(),// <- changed here
//     included: z.array(z.string()).optional(),
//     excluded: z.array(z.string()).optional(),
//     amenities: z.array(z.string()).optional(),
//     tourPlan: z.array(z.string()).optional(),
//     maxGuest: z.number().optional(),
//     minAge: z.number().optional(),
//     division: z.string(),
//     departureLocation: z.string().optional(),
//     arrivalLocation: z.string().optional()
// });
// export const updateTourZodSchema = z.object({
//     title: z.string().optional(),
//     slug:z.string().optional(),
//     description: z.string().optional(),
//     location: z.string().optional(),
//     costFrom: z.number().optional(),
//     startDate: z.string().optional().optional(),
//     endDate: z.string().optional().optional(),
//     tourType: z.string().optional(),// <- changed here
//     included: z.array(z.string()).optional(),
//     excluded: z.array(z.string()).optional(),
//     amenities: z.array(z.string()).optional(),
//     tourPlan: z.array(z.string()).optional(),
//     maxGuest: z.number().optional(),
//     minAge: z.number().optional(),
//     departureLocation: z.string().optional(),
//     arrivalLocation: z.string().optional()
// });
// Zod schema for creating a new tour
