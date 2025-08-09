import z from "zod";


export const forgotPasswordZodSchema = z.object({
    email: z
        .string({ invalid_type_error: "Invalid email address formate" })
        .min(5, { message: "email should be at least 5 character" })
        .max(50, { message: "email should contain maximum 50 chacacter" })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
})

export const resetPasswordZodSchema = z.object({
    newPassword:z
        .string({ invalid_type_error: "Invalid password type" })
        .regex(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?~\\/-]).{8,}$/,
          "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character"
        ),
    id:z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ObjectId'),
})