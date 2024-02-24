import validateRequest from '../../middlewares/validateRequest';
import { BrandControllers } from './brand.controller';
import express from 'express';
import { BrandValidations } from './brand.validation';

const router = express.Router();

router.post(
    '/create-brand',
    validateRequest(BrandValidations.createBrandValidationSchema),
    BrandControllers.createBrand,
);

router.get('/', BrandControllers.getAllBrands);

export const BrandRoutes = router;
