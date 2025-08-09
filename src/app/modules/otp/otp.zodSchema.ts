import z from "zod";

export const sendOtpZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "name must be a string" })
    .min(3, { message: "name must be at least three character" })
    .max(50, { message: "name should contain maximum 50 chacacter" }),
  email: z
    .string({ invalid_type_error: "Invalid email address formate" })
    .min(5, { message: "email should be at least 5 character" })
    .max(50, { message: "email should contain maximum 50 chacacter" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});

export const verifyOtpZodSchema = z.object({
  email: z
    .string({ invalid_type_error: "Invalid email address formate" })
    .min(5, { message: "email should be at least 5 character" })
    .max(50, { message: "email should contain maximum 50 chacacter" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  otp: z
    .string()
    .min(6, { message: "OTP must be exactly 6 digits" })
    .max(6, { message: "OTP must be exactly 6 digits" }),
});
