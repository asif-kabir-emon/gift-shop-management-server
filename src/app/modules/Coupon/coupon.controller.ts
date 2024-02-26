import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CouponServices } from './coupon.service';

const createCoupon = catchAsync(async (req, res) => {
    const result = await CouponServices.createCouponIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Coupon created successfully.',
        data: result,
    });
});

const getAllCoupons = catchAsync(async (req, res) => {
    const result = await CouponServices.getAllCouponsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Coupons fetched successfully.',
        data: result,
    });
});

const getCouponById = catchAsync(async (req, res) => {
    const result = await CouponServices.getCouponByIdFromDB(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Coupon fetched successfully.',
        data: result,
    });
});

const updateCoupon = catchAsync(async (req, res) => {
    const result = await CouponServices.updateCouponIntoDB(
        req.params.id,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Coupon updated successfully.',
        data: result,
    });
});

export const CouponControllers = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
};
