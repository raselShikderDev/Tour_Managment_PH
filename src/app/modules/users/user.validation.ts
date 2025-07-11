import z from "zod";
import { isActive, role } from "./user.interface";

export const createZodValidation = z.object({
  name: z
    .string({ invalid_type_error: "name must be a string" })
    .min(3, { message: "name must be at least three character" })
    .max(50, { message: "name should contain maximum 50 chacacter" }),
  email: z
    .string({ invalid_type_error: "Invalid email address formate" })
    .min(5, { message: "email should be at least 5 character" })
    .max(50, { message: "email should contain maximum 50 chacacter" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: z
    .string({ invalid_type_error: "Invalid password type" })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\\/-]).{8,}$/,
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character"
    ),
  phone: z
    .string({ invalid_type_error: "Invalid phone type" })
    .regex(
      /^(?:\+880|880|0)1[3-9]\d{8}$/,
      "Invalid Bangladeshi phone number format"
    )
    .optional(),
  address: z
    .string({ invalid_type_error: "Invalid address type" })
    .max(200, { message: "Addres must no more than 200 character" })
    .optional(),
});

export const updateUserZodValidation =  z.object({
  name: z
    .string({ invalid_type_error: "name must be a string" })
    .min(3, { message: "name must be at least three character" })
    .max(50, { message: "name should contain maximum 50 chacacter" }).optional(),
  email: z
    .string({ invalid_type_error: "Invalid email address formate" })
    .min(5, { message: "email should be at least 5 character" })
    .max(50, { message: "email should contain maximum 50 chacacter" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).optional(),
  password: z
    .string({ invalid_type_error: "Invalid password type" })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\\/-]).{8,}$/,
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character"
    ).optional(),
  phone: z
    .string({ invalid_type_error: "Invalid phone type" })
    .regex(
      /^(?:\+880|880|0)1[3-9]\d{8}$/,
      "Invalid Bangladeshi phone number format"
    )
    .optional(),
  address: z
    .string({ invalid_type_error: "Invalid address type" })
    .max(200, { message: "Addres must no more than 200 character" })
    .optional(),
  role:z.enum(Object.values(role) as [string]).optional(),
  isActive:z.enum(Object.values(isActive) as [string]).optional(),
  isDeleted:z.boolean({invalid_type_error:"isDeleted must a boolean"}).optional(),
  isVerified:z.boolean({invalid_type_error:"isVerified must a boolean"}).optional(),
});
