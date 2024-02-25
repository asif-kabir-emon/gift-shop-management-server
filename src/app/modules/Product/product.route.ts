import express, { NextFunction, Request, Response } from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
    '/create-product',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
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
