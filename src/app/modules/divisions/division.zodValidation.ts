import z from "zod";


export const createDivisionZodValidation = z.object({
  name: z
    .string({ invalid_type_error: "name must be a string" })
    .min(1, { message: "name must be at least one character" }),
  slug: z
    .string({ invalid_type_error: "slug must be a string" })
    .min(1, { message: "slug must be at least one character" }),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});

export const updateDivisionZodValidation = createDivisionZodValidation.partial()