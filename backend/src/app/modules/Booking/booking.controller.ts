import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { BookingService } from './booking.service';

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const result = await BookingService.createBookingIntoDB(req.body, user.id);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: 'Booking created successfully',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const result = await BookingService.getAllBookingsFromDB(user.role, user.id);

        if (result.length === 0) {
            res.status(httpStatus.OK).json({
                success: true,
                message: 'No bookings found',
                data: [],
            });
            return;
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: user.role === 'customer' ? 'Your bookings retrieved successfully' : 'Bookings retrieved successfully',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body; // 'cancelled' or 'returned'
        const user = req.user;

        const result = await BookingService.updateBookingIntoDB(bookingId, status, user.id, user.role);

        res.status(httpStatus.OK).json({
            success: true,
            message: status === 'returned' ? 'Booking marked as returned. Vehicle is now available' : 'Booking cancelled successfully',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const BookingController = {
    createBooking,
    getAllBookings,
    updateBooking,
};
