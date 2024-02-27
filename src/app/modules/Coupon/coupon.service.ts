import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCoupon } from './coupon.interface';
import { CouponModel } from './coupon.model';

const createCouponIntoDB = async (payload: TCoupon) => {
    payload.code = payload.code.toUpperCase();

    payload.startDate = payload.startDate.split('T')[0];
    payload.expiryDate = payload.expiryDate.split('T')[0];

    // console.log('startDate', payload.startDate);
    // console.log('expiryDate', payload.expiryDate);

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
    const currentDate = new Date().toISOString().split('T')[0];
    // console.log('currentDate', currentDate);

    const result = await CouponModel.find({
        expiryDate: { $gte: currentDate },
        isDeleted: false,
    });
    return result;
};

const getCouponByIdFromDB = async (id: string) => {
    const result = await CouponModel.findOne({ _id: id, isDeleted: false });
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

const deleteCouponFromDB = async (id: string) => {
    const result = await CouponModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );
    if (!result) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Coupon not deleted!!!',
        );
    }
    return result;
};

export const CouponServices = {
    createCouponIntoDB,
    getAllCouponsFromDB,
    getCouponByIdFromDB,
    updateCouponIntoDB,
    deleteCouponFromDB,
};
