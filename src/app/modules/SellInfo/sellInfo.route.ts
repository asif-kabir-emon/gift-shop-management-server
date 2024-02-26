import express from 'express';
import { SaleInfoControllers } from './sellInfo.controller';
import validateRequest from '../../middlewares/validateRequest';
import { saleInfoValidations } from './sellInfo.validation';

const router = express.Router();

router.post(
    '/create-sale-info',
    validateRequest(saleInfoValidations.createSaleInfoValidationSchema),
    SaleInfoControllers.createSaleInfo,
);

router.get('/get-sale-info', SaleInfoControllers.getSaleInfo);

export const SaleInfoRoutes = router;
