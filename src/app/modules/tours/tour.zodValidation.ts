import { z } from "zod";

export const createTourZodSchema = z.object({
    // Required fields
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }).min(1, "Title cannot be empty"),
    tourType: z.string({ // Assuming tourType is a string (ObjectId string)
        required_error: "Tour type is required",
        invalid_type_error: "Tour type must be a string"
    }).min(1, "Tour type cannot be empty"),
    division: z.string({ // Assuming division is a string (ObjectId string)
        required_error: "Division is required",
        invalid_type_error: "Division must be a string"
    }).min(1, "Division cannot be empty"),

    // Optional fields
    description: z.string().optional(),
    location: z.string().optional(),
    costForm: z.number({ // Match Mongoose schema: costForm, type Number
        invalid_type_error: "Cost must be a number"
    }).optional(),
    images: z.array(z.string()).optional(), // Match Mongoose schema: images, type Array of String
    startDate: z.string().datetime({ message: "Start date must be a valid date string" }).optional(),
    endDate: z.string().datetime({ message: "End date must be a valid date string" }).optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number({
        invalid_type_error: "Max guest must be a number"
    }).int("Max guest must be an integer").positive("Max guest must be a positive number").optional(),
    minAge: z.number({
        invalid_type_error: "Min age must be a number"
    }).int("Min age must be an integer").positive("Min age must be a positive number").optional(),
});

// Zod schema for updating an existing tour
export const updateTourZodSchema = z.object({
    // All fields are optional for updates
    title: z.string().optional(),
    slug: z.string().optional(), // slug is unique and usually generated, but allowing update here
    description: z.string().optional(),
    location: z.string().optional(),
    costForm: z.number({ // Match Mongoose schema: costForm, type Number
        invalid_type_error: "Cost must be a number"
    }).optional(),
    images: z.array(z.string()).optional(), // Match Mongoose schema: images, type Array of String
    startDate: z.string().datetime({ message: "Start date must be a valid date string" }).optional(),
    endDate: z.string().datetime({ message: "End date must be a valid date string" }).optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number({
        invalid_type_error: "Max guest must be a number"
    }).int("Max guest must be an integer").positive("Max guest must be a positive number").optional(),
    minAge: z.number({
        invalid_type_error: "Min age must be a number"
    }).int("Min age must be an integer").positive("Min age must be a positive number").optional(),
    tourType: z.string().optional(), 
    division: z.string().optional(),
    deleteImages: z.array(z.string()).optional()
});



export const createTourTypeZodSchema = z.object({
    name: z.string(),
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
