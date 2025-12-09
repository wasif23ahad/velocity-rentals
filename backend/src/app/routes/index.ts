import { Router } from 'express';
import { Router } from 'express';

const router = Router();

import { AuthRoutes } from '../modules/Auth/auth.route';
import { VehicleRoutes } from '../modules/Vehicle/vehicle.route';
import { UserRoutes } from '../modules/User/user.route';
import { BookingRoutes } from '../modules/Booking/booking.route';

const moduleRoutes: any[] = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/vehicles',
        route: VehicleRoutes,
    },
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/bookings',
        route: BookingRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
