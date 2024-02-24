import express from 'express';
import { OccasionControllers } from './occasion.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OccasionValidations } from './occasion.validation';

const router = express.Router();

router.post(
    '/create-occasion',
    validateRequest(OccasionValidations.createOccasionValidation),
    OccasionControllers.createOccasion,
);

router.get('/', OccasionControllers.getAllOccasions);

export const OccasionRoutes = router;
