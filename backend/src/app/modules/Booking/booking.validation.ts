import { z } from 'zod';

const createBookingValidationSchema = z.object({
    body: z.object({
        customer_id: z.string().optional(), // In case admin creates for someone? But usually logic infers it? Spec says "Customer or Admin". Logic: if admin, maybe can specify customerId? If customer, use own ID.
        // The spec example shows "customer_id" in body. So let's allow it but validate.
        vehicle_id: z.string(),
        rent_start_date: z.string().datetime().or(z.string()), // Accept ISO string
        rent_end_date: z.string().datetime().or(z.string())
    }),
});

const returnBookingValidationSchema = z.object({
    body: z.object({
        status: z.enum(['returned'])
    })
});

const updateBookingValidationSchema = z.object({
    body: z.object({
        status: z.enum(['cancelled', 'returned'])
    })
});


export const BookingValidation = {
    createBookingValidationSchema,
    returnBookingValidationSchema,
    updateBookingValidationSchema
};
