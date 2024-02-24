import { z } from 'zod';

const createUserValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
            })
            .min(3, {
                message: 'Name is at least 3 character long',
            })
            .max(50, {
                message: 'Name is too long',
            }),
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email({
                message: 'Email is invalid',
            }),
        password: z
            .string({
                required_error: 'Password is required',
            })
            .min(8, {
                message: 'Password is at least 8 character long',
            })
            .max(50, {
                message: 'Password is too long',
            }),
    }),
});

export const UserValidation = {
    createUserValidationSchema,
};
