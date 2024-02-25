/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct, TProductQuery } from './product.interface';
import { Product } from './product.model';
import { CategoryModel } from '../Category/category.model';
import { BrandModel } from '../Brand/brand.model';
import { OccasionModel } from '../Occasion/occasion.model';
import { ThemeModel } from '../Theme/theme.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createProductIntoDB = async (file: any, payload: TProduct) => {
    const isProductExist = await Product.findOne({
        name: payload.name,
        isDeleted: false,
    });
    if (isProductExist) {
        throw new AppError(
            httpStatus.CONFLICT,
            'Product already exist with this name',
        );
    }

    const isCategoryExist = await CategoryModel.find({
        _id: { $in: payload.category },
        isDeleted: false,
    });
    if (
        !isCategoryExist ||
        isCategoryExist.length !== payload.category.length
    ) {
        throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }

    const isBrandExist = await BrandModel.findOne({
        _id: payload.brand,
        isDeleted: false,
    });
    if (!isBrandExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Brand not found');
    }

    const isOccasionExist = await OccasionModel.find({
        _id: {
            $in: payload.occasion,
        },
        isDeleted: false,
    });
    if (
        !isOccasionExist ||
        isOccasionExist.length !== payload.occasion.length
    ) {
        throw new AppError(httpStatus.NOT_FOUND, 'Occasion not found');
    }

    const isThemeExist = await ThemeModel.find({
        _id: {
            $in: payload.theme,
        },
        isDeleted: false,
    });
    if (!isThemeExist || isThemeExist.length !== payload.theme.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'Theme not found');
    }

    const result = await Product.create(payload);

    if (!result) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Product not created',
        );
    }

    let imageURL;
    if (file && result) {
        const imageName = `gift_shop_product_${result._id}_${payload?.name}`;
        const { secure_url } = (await sendImageToCloudinary(
            imageName,
            file?.path,
        )) as { secure_url: string };

        imageURL = secure_url as string;
    }

    const update = await Product.findByIdAndUpdate(
        result._id,
        {
            imageURL: imageURL,
        },
        { new: true },
    );

    return update;
};

const getAllProductsFromDB = async (query: TProductQuery) => {
    let queryBuilder: Record<string, any> = {
        isDeleted: false,
        quantity: { $gt: 0 },
    };
    if (query.category && query.category) {
        const result = await CategoryModel.find({
            _id: {
                $in: query.category,
            },
            isDeleted: false,
        });
        if (!result || result.length !== query.category.length) {
            throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
        }
        queryBuilder = {
            ...queryBuilder,
            category: {
                $in: query.category,
            },
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
        const result = await OccasionModel.find({
            _id: {
                $in: query.occasion,
            },
            isDeleted: false,
        });
        if (!result || result.length !== query.occasion.length) {
            throw new AppError(httpStatus.NOT_FOUND, 'Occasion not found');
        }
        queryBuilder = {
            ...queryBuilder,
            occasion: {
                $in: query.occasion,
            },
        };
    }

    if (query.theme && query.theme) {
        const result = await ThemeModel.find({
            _id: {
                $in: query.theme,
            },
            isDeleted: false,
        });
        if (!result || result.length !== query.theme.length) {
            throw new AppError(httpStatus.NOT_FOUND, 'Theme not found');
        }
        queryBuilder = {
            ...queryBuilder,
            theme: {
                $in: query.theme,
            },
        };
    }

    if (query.minPrice && Number(String(query.minPrice)) >= 0) {
        queryBuilder.price = {
            ...queryBuilder.price,
            $gte: Number(String(query.minPrice)),
        };
    }

    if (query.maxPrice && Number(String(query.maxPrice)) >= 0) {
        queryBuilder.price = {
            ...queryBuilder.price,
            $lte: Number(String(query.maxPrice)),
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

    const result = await Product.find(queryBuilder)
        .populate('category')
        .populate('brand')
        .populate('occasion')
        .populate('theme');
    return result;
};

const getProductByIdFromDB = async (productId: string) => {
    const result = await Product.findById(productId);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    return result;
};

const removeProductFromDB = async (productId: string) => {
    const isProductExist = await Product.findOne({
        _id: productId,
        isDeleted: false,
    });
    if (!isProductExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    const result = await Product.findByIdAndUpdate(
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
    const isProductExist = await Product.find({
        _id: { $in: productIds },
        isDeleted: false,
    });
    if (!isProductExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
    const result = await Product.updateMany(
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
    const isProductExist = await Product.findById(productId);
    if (!isProductExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    if (payload.name && payload.name !== isProductExist.name) {
        const isNameUnique = await Product.findOne({
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

    const result = await Product.findByIdAndUpdate(productId, payload, {
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
