import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            default: 0,
            min: 0,
        },
        description: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            default: '',
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'categories',
            required: true,
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'brands',
            required: true,
        },
        occasion: {
            type: Schema.Types.ObjectId,
            ref: 'occasions',
            required: true,
        },
        theme: {
            type: Schema.Types.ObjectId,
            ref: 'themes',
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const ProductModel = model<TProduct>('products', productSchema);
