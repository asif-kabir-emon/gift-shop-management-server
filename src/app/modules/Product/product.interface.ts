import { Schema } from 'mongoose';

export type TProduct = {
    name: string;
    price: number;
    quantity: number;
    description: string;
    imageURL?: string;
    category: Schema.Types.ObjectId[];
    brand: Schema.Types.ObjectId;
    occasion: Schema.Types.ObjectId[];
    theme: Schema.Types.ObjectId[];
    isDeleted: boolean;
};

export type TProductQuery = {
    name?: string;
    category?: string;
    brand?: string;
    occasion?: string;
    theme?: string;
    minPrice?: number;
    maxPrice?: number;
};
