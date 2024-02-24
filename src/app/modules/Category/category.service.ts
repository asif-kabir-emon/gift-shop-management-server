import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCategory } from './category.interface';
import { CategoryModel } from './category.model';

const createCategoryIntoDB = async (category: TCategory) => {
    const findCategory = await CategoryModel.findOne({
        name: category.name.toLowerCase(),
    });
    if (findCategory) {
        throw new AppError(httpStatus.CONFLICT, 'Category already exists');
    }

    const newCategory = await CategoryModel.create({
        name: category.name.toLowerCase(),
    });
    return newCategory;
};

const getAllCategoriesFromDB = async () => {
    const categories = await CategoryModel.find({ isDeleted: false });
    return categories;
};

export const CategoryServices = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
};
