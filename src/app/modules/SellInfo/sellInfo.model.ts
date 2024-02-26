import { Schema, model } from 'mongoose';
import { TSaleInfo } from './sellInfo.interface';

const saleInfoSchema = new Schema<TSaleInfo>(
    {
        quantity: {
            type: Number,
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true,
        },
        sellId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        buyerName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const SaleInfoModel = model<TSaleInfo>('saleInfos', saleInfoSchema);
