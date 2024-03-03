import { z } from 'zod';

const invoiceProductsValidationSchema = z.object({
    productId: z.string({
        required_error: 'Product ID is required',
    }),
    productName: z.string({
        required_error: 'Product name is required',
    }),
    price: z
        .number({
            required_error: 'Price is required',
        })
        .min(1, {
            message: 'Price should be greater than 0',
        }),
    quantity: z
        .number({
            required_error: 'Quantity is required',
        })
        .min(1),
});

const createInvoiceValidationSchema = z.object({
    body: z.object({
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
        totalAmountAfterDiscount: z
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
        products: z
            .array(invoiceProductsValidationSchema)
            .refine((data) => data.length > 0, {
                message: 'Product is required',
            }),
        sellDate: z.string({
            required_error: 'Sell date is required',
        }),
        sellerId: z.string({
            required_error: 'Sell ID is required',
        }),
    }),
});

export const invoiceValidations = {
    createInvoiceValidationSchema,
};
