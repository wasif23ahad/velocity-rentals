import { PrismaClient, Booking, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const createBookingIntoDB = async (payload: { vehicle_id: string; rent_start_date: string; rent_end_date: string; customer_id?: string }, userId: string) => {

    // 1. Check vehicle availability
    const vehicle = await prisma.vehicle.findUnique({
        where: { id: payload.vehicle_id },
    });

    if (!vehicle) {
        throw new Error('Vehicle not found');
    }

    if (vehicle.availability_status === 'booked') {
        throw new Error('Vehicle is already booked');
    }

    // 2. Calculate price
    const startDate = new Date(payload.rent_start_date);
    const endDate = new Date(payload.rent_end_date);
    const durationInTime = endDate.getTime() - startDate.getTime();
    const durationInDays = durationInTime / (1000 * 3600 * 24);

    if (durationInDays < 0) {
        throw new Error('End date must be after start date');
    }

    const totalPrice = durationInDays * vehicle.daily_rent_price;

    // 3. Create Booking & Update Vehicle Status (Transaction)
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const booking = await tx.booking.create({
            data: {
                customer_id: payload.customer_id || userId, // Use payload customer_id if provided (admin case), else authenticated userId
                vehicle_id: payload.vehicle_id,
                rent_start_date: startDate,
                rent_end_date: endDate,
                total_price: totalPrice,
                status: 'active'
            },
            include: {
                vehicle: true, // as per spec response
                customer: true
            }
        });

        await tx.vehicle.update({
            where: { id: payload.vehicle_id },
            data: { availability_status: 'booked' }
        });

        return booking;
    });

    // Spec requires simpler response structure sometimes? 
    // Success Response (201 Created)
    //   "data": {
    //     "id": 1,
    //     "customer_id": 1,
    //     "vehicle_id": 2,
    //     ...
    //     "vehicle": { ... }
    //   }

    return result;
};

const getAllBookingsFromDB = async (role: string, userId: string) => {
    let where = {};
    if (role === 'customer') {
        where = { customer_id: userId };
    }

    // Admin sees all

    const result = await prisma.booking.findMany({
        where: where,
        include: {
            vehicle: true,
            customer: true
        }
    });
    return result;
};

const updateBookingIntoDB = async (bookingId: string, status: 'cancelled' | 'returned', userId: string, role: string) => {
    // Check booking exists
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    });

    if (!booking) {
        throw new Error('Booking not found');
    }

    // Authorization Check
    // Customer can cancel only own booking
    if (role === 'customer') {
        if (booking.customer_id !== userId) {
            throw new Error('You are not authorized to update this booking');
        }
        if (status !== 'cancelled') {
            throw new Error('Customer can only cancel booking');
        }

        // Spec: Cancel booking (before start date only)
        const now = new Date();
        const startDate = new Date(booking.rent_start_date);
        if (startDate <= now) {
            throw new Error('You can only cancel a booking before the start date');
        }
    }

    // Admin can mark as returned
    if (role === 'admin') {
        if (status !== 'returned' && status !== 'cancelled') { // maybe admin can cancel too? Spec only mentions "Mark as returned".
            // Assuming admin primarily sets to returned.
        }
    }

    // Update logic
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: { status },
            include: {
                vehicle: true,
                customer: true
            }
        });

        // If cancelled or returned, vehicle becomes available
        if (status === 'cancelled' || status === 'returned') {
            await tx.vehicle.update({
                where: { id: booking.vehicle_id },
                data: { availability_status: 'available' }
            });

            // The returned booking needs to have the vehicle status "available" in the response data inside vehicle object?
            // Prisma `include` might fetch the vehicle explicitly.
        }

        return updatedBooking;
    });

    return result;
};

export const BookingService = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    updateBookingIntoDB
};
