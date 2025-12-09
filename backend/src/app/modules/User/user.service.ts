import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const getAllUsersFromDB = async () => {
    const result = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<User>) => {
    const result = await prisma.user.update({
        where: {
            id,
        },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return result;
};

const deleteUserFromDB = async (id: string) => {
    // Check active bookings
    const activeBookings = await prisma.booking.findFirst({
        where: {
            customer_id: id,
            status: 'active'
        }
    });

    if (activeBookings) {
        throw new Error('Cannot delete user with active bookings');
    }

    const result = await prisma.user.delete({
        where: {
            id,
        },
    });
    return result;
};

export const UserService = {
    getAllUsersFromDB,
    updateUserIntoDB,
    deleteUserFromDB,
};
