import { z } from 'zod';

const createProductValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Product name is required',
            })
            .min(1)
            .max(255),
        price: z
            .number({
                required_error: 'Product price is required',
            })
            .min(0),
        quantity: z
            .number({
                required_error: 'Product quantity is required',
            })
            .min(0),
        description: z
            .string({
                required_error: 'Product description is required',
            })
            .min(1)
            .max(255),
        imageURL: z.string().min(1).max(255).optional(),
        category: z
            .array(
                z.string({
                    required_error: 'Product category is required',
                }),
            )
            .min(1)
            .max(255),
        brand: z
            .string({
                required_error: 'Product brand is required',
            })
            .min(1)
            .max(255),
        occasion: z
            .array(
                z.string({
                    required_error: 'Product occasion is required',
                }),
            )
            .min(1)
            .max(255),
        theme: z
            .array(
                z.string({
                    required_error: 'Product theme is required',
                }),
            )
            .min(1)
            .max(255),
    }),
});

const updateProductValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(255).optional(),
        price: z.number().min(0).optional(),
        quantity: z.number().min(0).optional(),
        description: z.string().min(1).max(255).optional(),
        imageURL: z.string().min(1).max(255).optional(),
        category: z.string().min(1).max(255).optional(),
        brand: z.string().min(1).max(255).optional(),
        occasion: z.string().min(1).max(255).optional(),
        theme: z.string().min(1).max(255).optional(),
    }),
});

const removeProductsValidationSchema = z.object({
    body: z.object({
        productIds: z.array(z.string()),
    }),
});

export const ProductValidations = {
    createProductValidationSchema,
    updateProductValidationSchema,
    removeProductsValidationSchema,
};
