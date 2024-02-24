import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OccasionServices } from './occasion.service';

const createOccasion = catchAsync(async (req, res) => {
    const result = await OccasionServices.createOccasionIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Occasion created successfully',
        data: result,
    });
});

const getAllOccasions = catchAsync(async (req, res) => {
    const result = await OccasionServices.getAllOccasionsFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Occasions fetched successfully',
        data: result,
    });
});

export const OccasionControllers = {
    createOccasion,
    getAllOccasions,
};
