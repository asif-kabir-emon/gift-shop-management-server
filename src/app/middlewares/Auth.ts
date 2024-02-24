import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { UserModel } from '../modules/User/user.model';

const auth = () => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers?.authorization;

            if (!token) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized!',
                );
            }

            const decoded = jwt.verify(
                token,
                config.jwt_access_secret as string,
            ) as JwtPayload;

            req.user = decoded;
            const { id, email } = decoded;

            const user = await UserModel.findById(id);

            if (!user) {
                throw new AppError(httpStatus.NOT_FOUND, 'User not found');
            }
            if (user.email !== email) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized!',
                );
            }

            const isUserDeleted = user.isDeleted;

            if (isUserDeleted) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'This user is deleted',
                );
            }

            next();
        },
    );
};

export default auth;
