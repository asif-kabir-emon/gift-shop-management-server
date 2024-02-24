import express from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';

const router = express.Router();

router.post(
    '/create-product',
    validateRequest(ProductValidations.createProductValidationSchema),
    ProductControllers.createProduct,
);

router.get('/', ProductControllers.getAllProducts);

router.get('/:productId', ProductControllers.getProductById);

router.delete(
    '/',
    validateRequest(ProductValidations.removeProductsValidationSchema),
    ProductControllers.removeProducts,
);

router.delete('/:productId', ProductControllers.removeProduct);

router.put(
    '/:productId',
    validateRequest(ProductValidations.updateProductValidationSchema),
    ProductControllers.updateProduct,
);

export const ProductRoutes = router;
