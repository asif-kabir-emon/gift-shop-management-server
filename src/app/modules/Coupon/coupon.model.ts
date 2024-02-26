import { Schema, model } from 'mongoose';
import { TCoupon } from './coupon.interface';

const couponSchema = new Schema<TCoupon>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
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
            type: Date,
            required: true,
        },
        expiryDate: {
            type: Date,
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
