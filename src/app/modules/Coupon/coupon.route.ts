import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { couponValidations } from './coupon.validation';
import { CouponControllers } from './coupon.controller';
import auth from '../../middlewares/Auth';

const router = express.Router();

router.post(
    '/create-coupon',
    validateRequest(couponValidations.createCouponValidationSchema),
    CouponControllers.createCoupon,
);

router.get('/', CouponControllers.getAllCoupons);

router.get('/:id', CouponControllers.getCouponById);

router.put(
    '/update-coupon/:id',
    validateRequest(couponValidations.createCouponValidationSchema),
    CouponControllers.updateCoupon,
);

router.delete('/delete-coupon/:id', CouponControllers.deleteCoupon);

router.post(
    '/verify-coupon',
    auth(),
    validateRequest(couponValidations.verifyCouponValidationSchema),
    CouponControllers.verifyCoupon,
);

export const CouponRoutes = router;
