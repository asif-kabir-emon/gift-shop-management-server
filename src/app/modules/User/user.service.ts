import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import bcrypt from 'bcrypt';
import config from '../../config';

const createUserIntoDB = async (user: TUser) => {
    const userExistWithSameEmail = await UserModel.findOne({
        email: user.email,
    });
    if (userExistWithSameEmail) {
        throw new AppError(
            httpStatus.CONFLICT,
            'User already exists with same email',
        );
    }
    user.password = await bcrypt.hash(
        user.password,
        parseInt(config.salt_round as string),
    );
    const createdUser = await UserModel.create(user);
    createdUser.password = '';
    return createdUser;
};

export const UserServices = {
    createUserIntoDB,
};
