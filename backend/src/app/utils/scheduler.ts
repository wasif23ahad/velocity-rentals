import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const autoReturnVehicles = async () => {
    try {
        const now = new Date();

        // Find all active bookings where end date is in the past
        const overdueBookings = await prisma.booking.findMany({
            where: {
                status: 'active',
                rent_end_date: {
                    lt: now
                }
            }
        });

        if (overdueBookings.length > 0) {
            console.log(`Found ${overdueBookings.length} overdue bookings. Processing returns...`);

            for (const booking of overdueBookings) {
                await prisma.$transaction(async (tx) => {
                    // Update booking status
                    await tx.booking.update({
                        where: { id: booking.id },
                        data: { status: 'returned' }
                    });

                    // Make vehicle available again
                    await tx.vehicle.update({
                        where: { id: booking.vehicle_id },
                        data: { availability_status: 'available' }
                    });
                });
                console.log(`Booking ${booking.id} auto-returned.`);
            }
        }
    } catch (error) {
        console.error('Error in auto-return scheduler:', error);
    }
};

export const initializeScheduler = () => {
    // Run every day at midnight (0 0 * * *)
    // For testing/demo purposes, we can run it every minute: '*/1 * * * *'
    // Let's stick to the requirement "when period ends" -> checking frequently is safer, or daily.
    // Daily check:
    cron.schedule('0 0 * * *', () => {
        console.log('Running daily auto-return check...');
        autoReturnVehicles();
    });

    console.log('Scheduler initialized: Auto-return check scheduled daily at midnight.');
};
