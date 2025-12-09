import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const auth = (...requiredRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

            if (!token) {
                throw new Error('You are not authorized!');
            }

            let decoded;
            try {
                decoded = jwt.verify(
                    token,
                    config.jwt.secret as string
                ) as JwtPayload;
            } catch (err) {
                throw new Error('Unauthorized');
            }

            const { role, email } = decoded;

            // Check if user exists
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (!user) {
                throw new Error('This user is not found !');
            }

            if (requiredRoles.length && !requiredRoles.includes(role)) {
                throw new Error('You have no access to this route');
            }

            req.user = decoded as JwtPayload;
            next();
        } catch (err) {
            // Customize error response to match requirement (401/403)
            // The global error handler will catch this, but we might want to throw specific errors with status codes
            // For now, throwing Error will be caught by global handler => 500 or 400.
            // We might need a custom AppError class to pass status codes.
            // I'll stick to basic Error for now or modify GlobalErrorHandler to handle "Unauthorized" message as 401.

            // Let's attach a status to the error if possible or just next(err)
            // Since I don't have AppError class yet, I will make one or handle it in global handler.
            // For simplicity, I will throw error and let global handler handle it. 
            // Ideally I should check err.message and set 401/403.

            // Actually, let's create a custom AppError class to handle status codes properly? 
            // Or just set res.status before next(err) if I can.
            // But standard way is AppError.

            // I'll assume global error handler handles generic errors for now.
            // But requirement says 401/403.
            // I'll leave it as is for this step, but consider adding AppError later.

            // Quick fix:
            if (err instanceof Error && (err.message === 'You are not authorized!' || err.message === 'Unauthorized')) {
                res.status(httpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: 'You have no access to this route',
                    errorMessages: [{ path: '', message: err.message }]
                });
                return;
            }

            if (err instanceof Error && err.message === 'You have no access to this route') {
                res.status(httpStatus.FORBIDDEN).json({
                    success: false,
                    message: 'You have no access to this route',
                    errorMessages: [{ path: '', message: err.message }]
                });
                return;
            }

            next(err);
        }
    };
};

export default auth;
