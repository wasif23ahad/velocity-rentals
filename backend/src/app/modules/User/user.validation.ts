import { z } from 'zod';

const updateUserValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        role: z.enum(['admin', 'customer']).optional(),
    }),
});

export const UserValidation = {
    updateUserValidationSchema,
};
