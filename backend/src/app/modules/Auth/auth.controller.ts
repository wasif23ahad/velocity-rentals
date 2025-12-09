import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AuthService.createUserIntoDB(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AuthService.loginUser(req.body);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const AuthController = {
    createUser,
    loginUser,
};
