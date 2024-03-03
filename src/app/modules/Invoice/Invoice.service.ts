import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../Product/product.model';
import { TInvoice } from './Invoice.interface';
import mongoose from 'mongoose';
import { InvoiceModel } from './Invoice.model';
import { UserModel } from '../User/user.model';
import { CouponServices } from '../Coupon/coupon.service';

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
                    'Failed to buy items',
                );
            }
        }

        const newInvoice = await InvoiceModel.create([payload], {
            session,
        });
        if (!newInvoice) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to buy items');
        }

        const result = await InvoiceModel.findById(newInvoice[0]._id, {
            session,
        })
            .populate('productId')
            .populate('sellerId');

        await session.commitTransaction();
        await session.endSession();

        return result;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to buy items');
    }
};

const getInvoiceFromDB = async (payload: {
    startDate?: string;
    endDate?: string;
}) => {
    if (payload.startDate && payload.endDate) {
        const startDateObj = new Date(payload.startDate);
        const endDateObj = new Date(payload.endDate);
        endDateObj.setHours(23, 59, 59, 0);

        const result = await InvoiceModel.find({
            createdAt: {
                $gte: startDateObj,
                $lte: endDateObj,
            },
        })
            .populate('productId')
            .populate('sellerId')
            .sort({ createdAt: -1 });
        return result;
    } else {
        const result = await InvoiceModel.find()
            .populate('productId')
            .populate('sellerId')
            .sort({ createdAt: -1 });
        return result;
    }
};

export const InvoiceServices = {
    createSaleInfoIntoDB,
    getInvoiceFromDB,
};
