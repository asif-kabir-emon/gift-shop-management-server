import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TBrand } from './brand.interface';
import { BrandModel } from './brand.model';

const createBrandIntoDB = async (payload: TBrand) => {
    const findBrand = await BrandModel.findOne({
        name: payload.name.toLowerCase(),
    });
    if (findBrand) {
        throw new AppError(httpStatus.CONFLICT, 'Brand already exists');
    }

    const result = await BrandModel.create({
        name: payload.name.toLowerCase(),
    });
    return result;
};

const getAllBrandsFromDB = async () => {
    const result = await BrandModel.find({ isDeleted: false });
    return result;
};

export const BrandServices = {
    createBrandIntoDB,
    getAllBrandsFromDB,
};
