import { Schema, model } from 'mongoose';
import { TCoupon } from './coupon.interface';

const couponSchema = new Schema<TCoupon>(
    {
        code: {
            type: String,
            required: true,
        },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
        },
        discountAmount: {
            type: Number,
            required: true,
        },
        minOrder: {
            type: Number,
            required: true,
        },
        haveMaxDiscount: {
            type: Boolean,
            required: true,
        },
        maxDiscount: {
            type: Number,
            default: null,
        },
        startDate: {
            type: String,
            required: true,
        },
        expiryDate: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const CouponModel = model<TCoupon>('coupons', couponSchema);
