import validateRequest from '../../middlewares/validateRequest';
import { CategoryControllers } from './category.controller';
import express from 'express';
import { CategoryValidations } from './category.validation';

const router = express.Router();

router.post(
    '/create-category',
    validateRequest(CategoryValidations.createCategoryValidationSchema),
    CategoryControllers.createCategory,
);

router.get('/', CategoryControllers.getAllCategories);

export const CategoryRoutes = router;
