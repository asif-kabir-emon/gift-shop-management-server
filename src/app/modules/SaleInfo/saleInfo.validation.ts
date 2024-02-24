import { z } from 'zod';

const createSaleInfoValidationSchema = z.object({
    body: z.object({
        quantity: z
            .number({
                required_error: 'Quantity is required',
            })
            .min(1),
        productId: z.string({
            required_error: 'Product ID is required',
        }),
        buyerName: z.string({
            required_error: 'Buyer name is required',
        }),
    }),
});

export const saleInfoValidations = {
    createSaleInfoValidationSchema,
};
