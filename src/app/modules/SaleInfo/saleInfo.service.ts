import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ProductModel } from '../Product/product.model';
import { TSaleInfo } from './saleInfo.interface';
import mongoose from 'mongoose';
import { SaleInfoModel } from './saleInfo.model';

const createSaleInfoIntoDB = async (saleInfo: TSaleInfo) => {
    const isProductExist = await ProductModel.findById(saleInfo.productId);
    if (!isProductExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    if (isProductExist.quantity === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Product is out of stock');
    }
    if (isProductExist.quantity < saleInfo.quantity) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Not enough quantity');
    }

    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        const reduceProductQuantity = await ProductModel.findByIdAndUpdate(
            saleInfo.productId,
            { $inc: { quantity: -saleInfo.quantity } },
            { new: true, session },
        );

        if (!reduceProductQuantity) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to buy items');
        }

        const createSaleInfo = await SaleInfoModel.create([saleInfo], {
            session,
        });
        if (!createSaleInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to buy items');
        }

        await session.commitTransaction();
        await session.endSession();

        return createSaleInfo;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to buy items');
    }
};

const getSaleInfoFromDB = async (payload: {
    startDate?: string;
    endDate?: string;
}) => {
    if (payload.startDate && payload.endDate) {
        const result = await SaleInfoModel.find({
            createdAt: {
                $gte: new Date(payload.startDate),
                $lte: new Date(payload.endDate),
            },
        })
            .populate('productId')
            .sort({ createdAt: -1 });
        return result;
    }
    const result = await SaleInfoModel.find()
        .populate('productId')
        .sort({ createdAt: -1 });
    return result;
};

export const SaleInfoServices = {
    createSaleInfoIntoDB,
    getSaleInfoFromDB,
};
