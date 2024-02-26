import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCoupon } from './coupon.interface';
import { CouponModel } from './coupon.model';

const createCouponIntoDB = async (payload: TCoupon) => {
    const result = await CouponModel.create(payload);
    if (!result) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Coupon not created!!!',
        );
    }

    return result;
};

const getAllCouponsFromDB = async () => {
    const currentDate = new Date();

    const result = await CouponModel.find({
        startDate: { $gte: currentDate },
        expiryDate: { $lte: currentDate },
        isDeleted: false,
    });
    console.log('result', result);
    return result;
};

const getCouponByIdFromDB = async (id: string) => {
    const result = await CouponModel.findById(id);
    return result;
};

const updateCouponIntoDB = async (id: string, payload: Partial<TCoupon>) => {
    const result = await CouponModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Coupon not updated!!!',
        );
    }
    return result;
};

export const CouponServices = {
    createCouponIntoDB,
    getAllCouponsFromDB,
    getCouponByIdFromDB,
    updateCouponIntoDB,
};
