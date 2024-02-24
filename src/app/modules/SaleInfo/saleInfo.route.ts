import express from 'express';
import { SaleInfoControllers } from './saleInfo.controller';
import validateRequest from '../../middlewares/validateRequest';
import { saleInfoValidations } from './saleInfo.validation';

const router = express.Router();

router.post(
    '/create-sale-info',
    validateRequest(saleInfoValidations.createSaleInfoValidationSchema),
    SaleInfoControllers.createSaleInfo,
);

router.get('/get-sale-info', SaleInfoControllers.getSaleInfo);

export const SaleInfoRoutes = router;
