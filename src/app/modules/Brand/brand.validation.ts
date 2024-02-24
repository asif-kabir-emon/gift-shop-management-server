import { z } from 'zod';

const createBrandValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Brand Name is required',
            })
            .min(1)
            .max(255),
    }),
});

export const BrandValidations = {
    createBrandValidationSchema,
};
