import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TTheme } from './theme.interface';
import { ThemeModel } from './theme.model';

const createThemeIntoDB = async (payload: TTheme) => {
    const isThemeExist = await ThemeModel.findOne({
        name: payload.name.toLowerCase(),
    });
    if (isThemeExist) {
        throw new AppError(httpStatus.CONFLICT, 'Theme already exist');
    }

    const result = await ThemeModel.create({
        name: payload.name.toLowerCase(),
    });
    return result;
};

const getAllThemeFromDB = async () => {
    const result = await ThemeModel.find({ isDeleted: false });
    return result;
};

export const ThemeServices = {
    createThemeIntoDB,
    getAllThemeFromDB,
};
