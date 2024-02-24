/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct, TProductQuery } from './product.interface';
import { ProductModel } from './product.model';
import { CategoryModel } from '../Category/category.model';
import { BrandModel } from '../Brand/brand.model';
import { OccasionModel } from '../Occasion/occasion.model';
import { ThemeModel } from '../Theme/theme.model';

const createProductIntoDB = async (product: TProduct) => {
    const isProductExist = await ProductModel.findOne({
        name: product.name,
        isDeleted: false,
    });
    if (isProductExist) {
        throw new AppError(
            httpStatus.CONFLICT,
            'Product already exist with this name',
        );
    }

    const isCategoryExist = await CategoryModel.findOne({
        _id: product.category,
        isDeleted: false,
    });
    if (!isCategoryExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }

    const isBrandExist = await BrandModel.findOne({
        _id: product.brand,
        isDeleted: false,
    });
    if (!isBrandExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Brand not found');
    }

    const isOccasionExist = await OccasionModel.findOne({
        _id: product.occasion,
        isDeleted: false,
    });
    if (!isOccasionExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Occasion not found');
    }

    const isThemeExist = await ThemeModel.findOne({
        _id: product.theme,
        isDeleted: false,
    });
    if (!isThemeExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Theme not found');
    }

    const result = await ProductModel.create(product);

    if (!result) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Product not created',
        );
    }

    return result;
};

const getAllProductsFromDB = async (query: TProductQuery) => {
    let queryBuilder: Record<string, any> = {
        isDeleted: false,
        quantity: { $gt: 0 },
    };
    if (query.category && query.category) {
        const result = await CategoryModel.findById(query.category);
        if (!result) {
            throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
        }
        queryBuilder = {
            ...queryBuilder,
            category: query.category,
        };
    }
    if (query.brand && query.brand) {
        const result = await BrandModel.findById(query.brand);
        if (!result) {
            throw new AppError(httpStatus.NOT_FOUND, 'Brand not found');
        }
        queryBuilder = {
            ...queryBuilder,
            brand: query.brand,
        };
    }

    if (query.occasion && query.occasion) {
        const result = await OccasionModel.findById(query.occasion);
        if (!result) {
            throw new AppError(httpStatus.NOT_FOUND, 'Occasion not found');
        }
        queryBuilder = {
            ...queryBuilder,
            occasion: query.occasion,
        };
    }

    if (query.theme && query.theme) {
        const result = await ThemeModel.findById(query.theme);
        if (!result) {
            throw new AppError(httpStatus.NOT_FOUND, 'Theme not found');
        }
        queryBuilder = {
            ...queryBuilder,
            theme: query.theme,
        };
    }

    if (query.minPrice && parseFloat(String(query.minPrice)) >= 0) {
        queryBuilder.price = {
            ...queryBuilder.price,
            $gte: parseFloat(String(query.minPrice)),
        };
    }

    if (query.maxPrice && parseFloat(String(query.maxPrice)) >= 0) {
        queryBuilder.price = {
            ...queryBuilder.price,
            $lte: parseFloat(String(query.maxPrice)),
        };
    }

    if (query.name) {
        queryBuilder = {
            ...queryBuilder,
            name: {
                $regex: query.name,
                $options: 'i',
            },
        };
    }

    const result = await ProductModel.find(queryBuilder)
        .populate('category')
        .populate('brand')
        .populate('occasion')
        .populate('theme');
    return result;
};

const getProductByIdFromDB = async (productId: string) => {
    const result = await ProductModel.findById(productId);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    return result;
};

const removeProductFromDB = async (productId: string) => {
    const isProductExist = await ProductModel.findOne({
        _id: productId,
        isDeleted: false,
    });
    if (!isProductExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    const result = await ProductModel.findByIdAndUpdate(
        productId,
        { isDeleted: true },
        { new: true },
    );
    if (!result?.isDeleted) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Product not deleted',
        );
    }
};

const removeProductsFromDB = async (productIds: string[]) => {
    const isProductExist = await ProductModel.find({
        _id: { $in: productIds },
        isDeleted: false,
    });
    if (!isProductExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    const result = await ProductModel.updateMany(
        { _id: { $in: productIds } },
        { isDeleted: true },
    );

    if (!result) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Product not deleted',
        );
    }
};

const updateProductFromDB = async (
    productId: string,
    payload: Partial<TProduct>,
) => {
    const isProductExist = await ProductModel.findById(productId);
    if (!isProductExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    if (payload.name && payload.name !== isProductExist.name) {
        const isNameUnique = await ProductModel.findOne({
            name: payload.name,
            isDeleted: false,
        });
        if (isNameUnique) {
            throw new AppError(
                httpStatus.CONFLICT,
                'Product already exist with this name',
            );
        }
    }

    if (payload.category) {
        const isCategoryExist = await CategoryModel.findById(payload.category);
        if (!isCategoryExist) {
            throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
        }
    }

    if (payload.brand) {
        const isBrandExist = await BrandModel.findById(payload.brand);
        if (!isBrandExist) {
            throw new AppError(httpStatus.NOT_FOUND, 'Brand not found');
        }
    }

    if (payload.occasion) {
        const isOccasionExist = await OccasionModel.findById(payload.occasion);
        if (!isOccasionExist) {
            throw new AppError(httpStatus.NOT_FOUND, 'Occasion not found');
        }
    }

    if (payload.theme) {
        const isThemeExist = await ThemeModel.findById(payload.theme);
        if (!isThemeExist) {
            throw new AppError(httpStatus.NOT_FOUND, 'Theme not found');
        }
    }

    const result = await ProductModel.findByIdAndUpdate(productId, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Product not updated',
        );
    }
    return result;
};

export const ProductServices = {
    createProductIntoDB,
    getAllProductsFromDB,
    getProductByIdFromDB,
    removeProductFromDB,
    removeProductsFromDB,
    updateProductFromDB,
};
