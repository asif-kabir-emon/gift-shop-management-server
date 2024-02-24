import { Schema } from 'mongoose';

export type TSaleInfo = {
    quantity: number;
    productId: Schema.Types.ObjectId;
    buyerName: string;
};
