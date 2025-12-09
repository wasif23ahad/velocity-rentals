import { PrismaClient, Vehicle } from '@prisma/client';

const prisma = new PrismaClient();

const createVehicleIntoDB = async (payload: Vehicle) => {
    const result = await prisma.vehicle.create({
        data: payload,
    });
    return result;
};

const getAllVehiclesFromDB = async () => {
    const result = await prisma.vehicle.findMany();
    return result;
};

const getSingleVehicleFromDB = async (id: string) => {
    const result = await prisma.vehicle.findUnique({
        where: {
            id,
        },
    });
    return result;
};

const updateVehicleIntoDB = async (id: string, payload: Partial<Vehicle>) => {
    const result = await prisma.vehicle.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
};

const deleteVehicleFromDB = async (id: string) => {
    // Check if vehicle has active bookings
    const activeBookings = await prisma.booking.findFirst({
        where: {
            vehicle_id: id,
            status: 'active',
        },
    });

    if (activeBookings) {
        throw new Error('Cannot delete vehicle with active bookings');
    }

    const result = await prisma.vehicle.delete({
        where: {
            id,
        },
    });
    return result;
};

export const VehicleService = {
    createVehicleIntoDB,
    getAllVehiclesFromDB,
    getSingleVehicleFromDB,
    updateVehicleIntoDB,
    deleteVehicleFromDB,
};
