import express from 'express';
import { VehicleController } from './vehicle.controller';
import validateRequest from '../../middlewares/validateRequest';
import { VehicleValidation } from './vehicle.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/',
    auth('admin'),
    validateRequest(VehicleValidation.createVehicleValidationSchema),
    VehicleController.createVehicle
);

router.get('/', VehicleController.getAllVehicles);

router.get('/:vehicleId', VehicleController.getSingleVehicle);

router.put(
    '/:vehicleId',
    auth('admin'),
    validateRequest(VehicleValidation.updateVehicleValidationSchema),
    VehicleController.updateVehicle
);

router.delete('/:vehicleId', auth('admin'), VehicleController.deleteVehicle);

export const VehicleRoutes = router;
