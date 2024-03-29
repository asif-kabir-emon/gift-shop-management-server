import { z } from 'zod';

const createCouponValidationSchema = z.object({
    body: z.object({
        code: z.string({
            required_error: 'Coupon Name is required',
        }),
        discountType: z.enum(['percentage', 'fixed']),
        discountAmount: z
            .number({
                required_error: 'Discount Amount is required',
            })
            .refine((val) => Number(val) > 0, {
                message: 'Discount Amount must be greater than 0',
            }),
        minOrder: z
            .number({
                required_error: 'Minimum Order is required',
            })
            .refine((val) => Number(val) > 0, {
                message: 'Minimum Order must be greater than 0',
            }),
        haveMaxDiscount: z.boolean({
            required_error: 'Have Maximum Discount is required',
        }),
        maxDiscount: z.number().optional(),
        startDate: z.string({
            required_error: 'Start Date is required',
        }),
        expiryDate: z.string({
            required_error: 'Expiry Date is required',
        }),
    }),
});

const updateCouponValidationSchema = z.object({
    body: z.object({
        code: z.string().optional(),
        discountType: z.enum(['percentage', 'fixed']).optional(),
        discountAmount: z
            .number()
            .refine((val) => Number(val) > 0, {
                message: 'Discount Amount must be greater than 0',
            })
            .optional(),
        minOrder: z
            .number()
            .refine((val) => Number(val) > 0, {
                message: 'Minimum Order must be greater than 0',
            })
            .optional(),
        haveMaxDiscount: z.boolean().optional(),
        maxDiscount: z.number().optional(),
        startDate: z.date().optional(),
        expiryDate: z.date().optional(),
    }),
});

const verifyCouponValidationSchema = z.object({
    body: z.object({
        code: z.string({
            required_error: 'Coupon Code is required',
        }),
        orderAmount: z
            .number({
                required_error: 'Order Amount is required',
            })
            .refine((val) => Number(val) > 0, {
                message: 'Order Amount must be greater than 0',
            }),
    }),
});

const getCouponByNameValidationSchema = z.object({
    body: z.object({
        code: z.string({
            required_error: 'Coupon Code is required',
        }),
    }),
});

export const couponValidations = {
    createCouponValidationSchema,
    updateCouponValidationSchema,
    verifyCouponValidationSchema,
    getCouponByNameValidationSchema,
};
