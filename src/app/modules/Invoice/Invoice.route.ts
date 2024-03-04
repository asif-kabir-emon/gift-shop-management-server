import express from 'express';
import { InvoiceControllers } from './Invoice.controller';
import validateRequest from '../../middlewares/validateRequest';
import { invoiceValidations } from './Invoice.validation';

const router = express.Router();

router.post(
    '/create-invoice',
    validateRequest(invoiceValidations.createInvoiceValidationSchema),
    InvoiceControllers.createInvoice,
);

router.get('/get-invoice', InvoiceControllers.getInvoice);

router.get('/get-invoice/:id', InvoiceControllers.getInvoiceById);

export const InvoiceRoutes = router;
