import { Schema, model } from 'mongoose';
import { TInvoice, TInvoiceProducts } from './Invoice.interface';

const invoiceProductsSchema = new Schema<TInvoiceProducts>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    },
    {
        _id: false,
        timestamps: false,
    },
);

const invoiceSchema = new Schema<TInvoice>(
    {
        totalAmount: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        totalAmountAfterDiscount: {
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
        products: {
            type: [invoiceProductsSchema],
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

export const InvoiceModel = model<TInvoice>('invoices', invoiceSchema);
