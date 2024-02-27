import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCoupon, TVerifyCoupon } from './coupon.interface';
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

const verifyCouponFromDB = async (payload: TVerifyCoupon) => {
    const currentDate = new Date().toISOString().split('T')[0];

    const isCouponValid = await CouponModel.find({
        code: payload.code.toUpperCase(),
        expiryDate: { $gte: currentDate },
        isDeleted: false,
    });

    if (isCouponValid.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Coupon is not valid!!!');
    }

    const coupon = isCouponValid[0];
    let discountAmount = 0;

    if (coupon.startDate > currentDate || coupon.expiryDate < currentDate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Coupon is not valid!!!');
    }

    if (coupon.minOrder > payload.orderAmount) {
        discountAmount = 0;
    } else if (coupon.haveMaxDiscount === true && coupon.maxDiscount) {
        if (coupon.discountType === 'percentage') {
            const tempDiscountAmount =
                (payload.orderAmount * coupon.discountAmount) / 100;

            if (tempDiscountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            } else {
                discountAmount = tempDiscountAmount;
            }
        } else {
            discountAmount = coupon.discountAmount;
        }
    } else {
        if (coupon.discountType === 'percentage') {
            discountAmount =
                (payload.orderAmount * coupon.discountAmount) / 100;
        } else {
            discountAmount = coupon.discountAmount;
        }
    }

    return {
        isCouponValid: true,
        discountAmount,
    };
};

export const CouponServices = {
    createCouponIntoDB,
    getAllCouponsFromDB,
    getCouponByIdFromDB,
    updateCouponIntoDB,
    deleteCouponFromDB,
    verifyCouponFromDB,
};
