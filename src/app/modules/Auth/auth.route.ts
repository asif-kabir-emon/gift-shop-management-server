import express from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import auth from '../../middlewares/Auth';

const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidations.loginUserValidationSchema),
    AuthControllers.loginUser,
);

router.post(
    '/change-password',
    auth(),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

router.post(
    '/refresh-token',
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

export const AuthRoutes = router;
