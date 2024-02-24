import { z } from 'zod';

const createCategoryValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Category Name is required',
            })
            .min(1)
            .max(255),
    }),
});

export const CategoryValidations = {
    createCategoryValidationSchema,
};
