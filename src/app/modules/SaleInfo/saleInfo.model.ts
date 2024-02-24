import { Schema, model } from 'mongoose';
import { TSaleInfo } from './saleInfo.interface';

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
        buyerName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const SaleInfoModel = model<TSaleInfo>('saleInfos', saleInfoSchema);
