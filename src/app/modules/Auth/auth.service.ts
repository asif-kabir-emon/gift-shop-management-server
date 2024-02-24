import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../User/user.model';
import { TChangePassword, TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import config from '../../config';
import { JwtPayload, verify } from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
    const findUser = await UserModel.findOne({ email: payload.email }).select(
        '+password',
    );
    if (!findUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        findUser.password,
    );
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid  Password!!!');
    }
    const jwtPayload = {
        id: String(findUser._id),
        email: findUser.email,
        role: findUser.role as string,
    };
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );
    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
    );
    return {
        accessToken,
        refreshToken,
    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: TChangePassword,
) => {
    const findUser = await UserModel.findById(userData.id).select('+password');
    if (!findUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (payload.oldPassword === payload.newPassword) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Old Password and New Password should not be same',
        );
    }

    const isPasswordMatched = await bcrypt.compare(
        payload.oldPassword,
        findUser.password,
    );
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid  Password!!!');
    }

    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        parseInt(config.salt_round as string),
    );
    await UserModel.findOneAndUpdate(
        { _id: userData.id },
        {
            password: newHashedPassword,
        },
    );
};

const refreshToken = async (token: string) => {
    const decoded = verify(
        token,
        config.jwt_refresh_secret as string,
    ) as JwtPayload;
    const { id } = decoded;

    const user = await UserModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isUserDeleted = user.isDeleted;
    if (isUserDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
    }

    const jwtPayload = {
        id: String(user._id),
        email: user.email,
        role: user.role as string,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };
};

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
};
