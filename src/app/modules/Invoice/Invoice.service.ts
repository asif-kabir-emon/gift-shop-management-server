import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../Product/product.model';
import { TInvoice } from './Invoice.interface';
import mongoose from 'mongoose';
import { InvoiceModel } from './Invoice.model';
import { UserModel } from '../User/user.model';
import { CouponServices } from '../Coupon/coupon.service';
import QueryBuilder from '../../builder/QueryBuilder';

const createSaleInfoIntoDB = async (payload: TInvoice) => {
    const isSellExist = await UserModel.findById(payload.sellerId);
    if (!isSellExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Seller not found');
    }

    for (const product of payload.products) {
        const isProductExist = await Product.findById(product.productId);
        if (!isProductExist) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Product not found');
        }
        if (isProductExist.quantity === 0) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Product is out of stock',
            );
        }
        if (isProductExist.quantity < product.quantity) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Not enough quantity');
        }
        if (product.price !== isProductExist.price) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Price is not correct');
        }
    }

    const totalAmount = payload.products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
    );

    if (totalAmount !== payload.totalAmount) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Total amount is not correct',
        );
    }

    if (payload.couponCode) {
        const discount = await CouponServices.verifyCouponFromDB({
            code: payload.couponCode,
            orderAmount: payload.totalAmount,
        });

        if (payload.discount !== discount.discountAmount) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Discount is not correct',
            );
        }
    }

    if (
        payload.totalAmountAfterDiscount !==
        payload.totalAmount - payload.discount
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Total amount after discount is not correct',
        );
    }

    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        for (const product of payload.products) {
            const reduceProductQuantity = await Product.findByIdAndUpdate(
                product.productId,
                { $inc: { quantity: -product.quantity } },
                { new: true, session },
            );

            if (!reduceProductQuantity) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Failed to buy items due to product quantity issue',
                );
            }
        }

        const newInvoice = await InvoiceModel.create([payload], {
            session,
        });
        if (newInvoice.length === 0) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to buy items');
        }

        await session.commitTransaction();
        await session.endSession();

        const result = newInvoice[0];
        return result;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to buy items');
    }
};

const getInvoiceFromDB = async (query: Record<string, unknown>) => {
    if (query.startDate && query.endDate) {
        const startDateObj = new Date(query.startDate as string);
        const endDateObj = new Date(query.endDate as string);
        endDateObj.setHours(23, 59, 59, 0);

        const invoiceQuery = new QueryBuilder(InvoiceModel.find(), {
            startDateObj,
            endDateObj,
            sort: '-createdAt',
            page: (query?.page as number) || 1,
            limit: (query?.limit as number) || 1,
        })
            .sort()
            .paginate();

        const result = await invoiceQuery.modelQuery
            .populate('products')
            .populate('sellerId')
            .sort({ createdAt: -1 });

        return result;
    } else {
        const invoiceQuery = new QueryBuilder(InvoiceModel.find(), {
            sort: '-createdAt',
            page: (query?.page as number) || 1,
            limit: (query?.limit as number) || 1,
        })
            .sort()
            .paginate();

        const result = await invoiceQuery.modelQuery
            .populate('products')
            .populate('sellerId')
            .sort({ createdAt: -1 });

        return result;
    }
};

const getInvoiceByIdFromDB = async (id: string) => {
    const result = await InvoiceModel.findById(id)
        .populate('products')
        .populate('sellerId');

    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invoice not found');
    }

    return result;
};

export const InvoiceServices = {
    createSaleInfoIntoDB,
    getInvoiceFromDB,
    getInvoiceByIdFromDB,
};
