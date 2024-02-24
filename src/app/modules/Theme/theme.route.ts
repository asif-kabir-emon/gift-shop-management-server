import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ThemeValidations } from './theme.validation';
import { ThemeControllers } from './theme.controller';

const router = express.Router();

router.post(
    '/create-theme',
    validateRequest(ThemeValidations.createThemeValidationSchema),
    ThemeControllers.createTheme,
);

router.get('/', ThemeControllers.getAllThemes);

export const ThemeRoutes = router;
