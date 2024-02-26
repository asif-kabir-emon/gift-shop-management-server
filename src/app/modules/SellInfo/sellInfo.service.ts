import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../Product/product.model';
import { TSaleInfo } from './sellInfo.interface';
import mongoose from 'mongoose';
import { SaleInfoModel } from './sellInfo.model';

const createSaleInfoIntoDB = async (saleInfo: TSaleInfo) => {
    const isProductExist = await Product.findById(saleInfo.productId);
    const isSellExist = await SaleInfoModel.findById(saleInfo.sellId);

    if (!isProductExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Product not found');
    }
    if (isProductExist.quantity === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Product is out of stock');
    }
    if (isProductExist.quantity < saleInfo.quantity) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Not enough quantity');
    }
    if (!isSellExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Seller not found');
    }

    const session = await mongoose.startSession();
    try {
        await session.startTransaction();

        const reduceProductQuantity = await Product.findByIdAndUpdate(
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
            .populate('sellId')
            .sort({ createdAt: -1 });
        return result;
    } else {
        const result = await SaleInfoModel.find()
            .populate('productId')
            .populate('sellId')
            .sort({ createdAt: -1 });
        return result;
    }
};

export const SaleInfoServices = {
    createSaleInfoIntoDB,
    getSaleInfoFromDB,
};
