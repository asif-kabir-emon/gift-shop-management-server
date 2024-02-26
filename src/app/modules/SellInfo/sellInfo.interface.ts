import { Schema } from 'mongoose';

export type TSaleInfo = {
    quantity: number;
    sellingPrice: number;
    totalAmount: number;
    buyerName: string;
    sellDate: Date;
    productId: Schema.Types.ObjectId;
    sellerId: Schema.Types.ObjectId;
};
