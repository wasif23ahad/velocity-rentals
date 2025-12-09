import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../../config';

// explicit type definition to ensure it's treated as error handler
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorMessages: { path: string | number; message: string }[] = [];

    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errorMessages = err.issues.map((issue) => ({
            path: issue.path[issue.path.length - 1],
            message: issue.message,
        }));
    } else if (err?.name === 'ValidationError') {
        // Handle Prisma/other validation errors if needed
        statusCode = 400;
        message = err.message;
    } else if (err instanceof Error) {
        message = err.message;
        errorMessages = [
            {
                path: '',
                message: err.message,
            },
        ];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorMessages, // Optional based on spec, but good for debugging
        stack: config.env === 'development' ? err?.stack : undefined,
    });
};

export default globalErrorHandler;
