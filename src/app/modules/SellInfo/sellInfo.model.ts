import { Schema, model } from 'mongoose';
import { TSaleInfo } from './sellInfo.interface';

const saleInfoSchema = new Schema<TSaleInfo>(
    {
        quantity: {
            type: Number,
            required: true,
        },
        sellingPrice: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        paidAmount: {
            type: Number,
            required: true,
        },
        couponCode: {
            type: String,
            required: false,
            default: null,
        },
        buyerName: {
            type: String,
            required: true,
        },
        sellDate: {
            type: Date,
            required: true,
            format: 'date',
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true,
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
    },
    { timestamps: true },
);

export const SaleInfoModel = model<TSaleInfo>('saleInfos', saleInfoSchema);
