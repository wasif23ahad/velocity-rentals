import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
    '/signup',
    validateRequest(AuthValidation.createUserValidationSchema),
    AuthController.createUser
);

router.post(
    '/signin',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthController.loginUser
);

export const AuthRoutes = router;
