import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { couponValidations } from './coupon.validation';
import { CouponControllers } from './coupon.controller';

const router = express.Router();

router.post(
    '/create-coupon',
    validateRequest(couponValidations.createCouponValidationSchema),
    CouponControllers.createCoupon,
);

router.get('/get-coupons', CouponControllers.getAllCoupons);

router.get('/get-coupon/:id', CouponControllers.getCouponById);

router.put(
    '/update-coupon/:id',
    validateRequest(couponValidations.createCouponValidationSchema),
    CouponControllers.updateCoupon,
);

export const CouponRoutes = router;
