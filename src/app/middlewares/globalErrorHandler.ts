/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';

    if (err.name === 'ZodError') {
        message = err.issues.map((issue: any) => issue.message).join(', ');
    }

    return res.status(statusCode).send({
        success: false,
        message,
        data: null,
    });
};

export default globalErrorHandler;
