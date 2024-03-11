import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { InvoiceServices } from './Invoice.service';

const createInvoice = catchAsync(async (req, res) => {
    const result = await InvoiceServices.createSaleInfoIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Items bought successfully',
        data: result,
    });
});

const getInvoice = catchAsync(async (req, res) => {
    const result = await InvoiceServices.getInvoiceFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Get sale info successfully',
        meta: result.meta,
        data: result.result,
    });
});

const getInvoiceById = catchAsync(async (req, res) => {
    const result = await InvoiceServices.getInvoiceByIdFromDB(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Get sale info by id successfully',
        data: result,
    });
});

export const InvoiceControllers = {
    createInvoice,
    getInvoice,
    getInvoiceById,
};
