import { Schema } from 'mongoose';

export type TSaleInfo = {
    quantity: number;
    sellingPrice: number;
    totalAmount: number;
    discount: number;
    paidAmount: number;
    couponCode?: string;
    buyerName: string;
    sellDate: Date;
    productId: Schema.Types.ObjectId;
    sellerId: Schema.Types.ObjectId;
};
