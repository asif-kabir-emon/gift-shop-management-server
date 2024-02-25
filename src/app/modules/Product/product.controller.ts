import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const createProduct = catchAsync(async (req, res) => {
    const file = req.file;
    const data = req.body;
    const result = await ProductServices.createProductIntoDB(file, data);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product created successfully',
        data: result,
    });
});

const getAllProducts = catchAsync(async (req, res) => {
    const query = req.query;
    const result = await ProductServices.getAllProductsFromDB(query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Products fetched successfully',
        data: result,
    });
});

const getProductById = catchAsync(async (req, res) => {
    const result = await ProductServices.getProductByIdFromDB(
        req.params.productId,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product fetched successfully',
        data: result,
    });
});

const removeProduct = catchAsync(async (req, res) => {
    const result = await ProductServices.removeProductFromDB(
        req.params.productId,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product deleted successfully',
        data: result,
    });
});

const removeProducts = catchAsync(async (req, res) => {
    const result = await ProductServices.removeProductsFromDB(
        req.body.productIds,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Products deleted successfully',
        data: result,
    });
});

const updateProduct = catchAsync(async (req, res) => {
    const result = await ProductServices.updateProductFromDB(
        req.params.productId,
        req.body,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Product updated successfully',
        data: result,
    });
});

export const ProductControllers = {
    createProduct,
    getAllProducts,
    getProductById,
    removeProduct,
    removeProducts,
    updateProduct,
};
