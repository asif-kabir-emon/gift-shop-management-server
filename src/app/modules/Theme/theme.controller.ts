import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ThemeServices } from './theme.service';

const createTheme = catchAsync(async (req, res) => {
    const result = await ThemeServices.createThemeIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Theme created successfully',
        data: result,
    });
});

const getAllThemes = catchAsync(async (req, res) => {
    const result = await ThemeServices.getAllThemeFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Themes fetched successfully',
        data: result,
    });
});

export const ThemeControllers = {
    createTheme,
    getAllThemes,
};
