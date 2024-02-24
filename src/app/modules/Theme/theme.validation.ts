import { z } from 'zod';

const createThemeValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
            })
            .min(3)
            .max(255),
    }),
});

export const ThemeValidations = {
    createThemeValidationSchema,
};
