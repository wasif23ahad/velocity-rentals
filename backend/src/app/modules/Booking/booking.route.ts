import express from 'express';
import { BookingController } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/',
    auth('customer', 'admin'),
    validateRequest(BookingValidation.createBookingValidationSchema),
    BookingController.createBooking
);

router.get(
    '/',
    auth('admin', 'customer'),
    BookingController.getAllBookings
);

// Unified update route logic handled in controller/service based on role
router.put(
    '/:bookingId',
    auth('admin', 'customer'),
    validateRequest(BookingValidation.updateBookingValidationSchema),
    BookingController.updateBooking
);

export const BookingRoutes = router;
