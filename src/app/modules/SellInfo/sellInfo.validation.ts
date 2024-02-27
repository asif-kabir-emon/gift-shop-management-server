import { z } from 'zod';

const createSaleInfoValidationSchema = z.object({
    body: z
        .object({
            quantity: z
                .number({
                    required_error: 'Quantity is required',
                })
                .min(1),
            sellingPrice: z
                .number({
                    required_error: 'Selling price is required',
                })
                .min(1, {
                    message: 'Selling price should be greater than 0',
                }),
            totalAmount: z
                .number({
                    required_error: 'Total amount is required',
                })
                .refine((data) => data > 0, {
                    message: 'Total amount should be greater than 0',
                }),
            discount: z
                .number({
                    required_error: 'Discount is required',
                })
                .refine((data) => data >= 0, {
                    message: 'Discount should be greater than or equal to 0',
                }),
            paidAmount: z
                .number({
                    required_error: 'Paid amount is required',
                })
                .refine((data) => data > 0, {
                    message: 'Paid amount should be greater than 0',
                }),
            couponCode: z.string().optional(),
            buyerName: z.string({
                required_error: 'Buyer name is required',
            }),
            sellDate: z.string({
                required_error: 'Sell date is required',
            }),
            productId: z.string({
                required_error: 'Product ID is required',
            }),
            sellerId: z.string({
                required_error: 'Sell ID is required',
            }),
        })
        .refine(
            (body) => {
                const { quantity, sellingPrice, totalAmount } = body;
                return quantity * sellingPrice === totalAmount;
            },
            {
                message:
                    'Total amount should be equal to (quantity x selling price)',
            },
        ),
});

export const saleInfoValidations = {
    createSaleInfoValidationSchema,
};
