import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SaleInfoServices } from './sellInfo.service';

const createSaleInfo = catchAsync(async (req, res) => {
    const result = await SaleInfoServices.createSaleInfoIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Items bought successfully',
        data: result,
    });
});

const getSaleInfo = catchAsync(async (req, res) => {
    const result = await SaleInfoServices.getSaleInfoFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Get sale info successfully',
        data: result,
    });
});

export const SaleInfoControllers = {
    createSaleInfo,
    getSaleInfo,
};
