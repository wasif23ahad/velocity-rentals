import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { UserService } from './user.service';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserService.getAllUsersFromDB();
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        // Check if user is trying to update their own profile or is admin
        const currentUser = req.user;

        if (currentUser.role !== 'admin' && currentUser.id !== userId) {
            throw new Error('You have no access to this route'); // Or Unauthorized/Forbidden
        }

        // If not admin, ensure they are not changing role
        if (currentUser.role !== 'admin' && req.body.role) {
            // Maybe throw error or just delete the role from body?
            // Requirement says "Customer: Update own profile only". Doesn't explicitly forbid role change but usually customer can't become admin.
            // Specification: "Admin: Update any user's role or details"
            // Implication: Customer cannot update role.
            delete req.body.role;
        }

        const result = await UserService.updateUserIntoDB(userId, req.body);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'User updated successfully',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        await UserService.deleteUserFromDB(userId);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};

export const UserController = {
    getAllUsers,
    updateUser,
    deleteUser,
};
