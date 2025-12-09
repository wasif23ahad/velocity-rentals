import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { VehicleService } from './vehicle.service';

const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await VehicleService.createVehicleIntoDB(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Vehicle created successfully',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getAllVehicles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await VehicleService.getAllVehiclesFromDB();
        if (result.length === 0) {
            res.status(httpStatus.OK).json({
                success: true,
                message: 'No vehicles found',
                data: [],
            });
            return;
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Vehicles retrieved successfully',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getSingleVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vehicleId } = req.params;
        const result = await VehicleService.getSingleVehicleFromDB(vehicleId);

        if (!result) {
            res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: 'Vehicle not found',
                data: null
            });
            return;
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Vehicle retrieved successfully',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vehicleId } = req.params;
        const result = await VehicleService.updateVehicleIntoDB(vehicleId, req.body);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Vehicle updated successfully',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { vehicleId } = req.params;
        await VehicleService.deleteVehicleFromDB(vehicleId);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Vehicle deleted successfully',
        });
    } catch (err) {
        next(err);
    }
};

export const VehicleController = {
    createVehicle,
    getAllVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};
