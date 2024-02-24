import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BrandServices } from './brand.service';

const createBrand = catchAsync(async (req, res) => {
    const result = await BrandServices.createBrandIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Brand created successfully',
        data: result,
    });
});

const getAllBrands = catchAsync(async (req, res) => {
    const result = await BrandServices.getAllBrandsFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Brands fetched successfully',
        data: result,
    });
});

export const BrandControllers = {
    createBrand,
    getAllBrands,
};
