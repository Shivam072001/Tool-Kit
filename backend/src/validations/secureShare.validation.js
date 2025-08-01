import { z } from 'zod';

export const createShareSchema = z.object({
    body: z.object({
        recipientEmail: z.string().email('Invalid recipient email.'),
        passwordItem: z.object({
            id: z.string(),
            name: z.string(),
            username: z.string(),
            password: z.string(),
        }),
        expiresIn: z.string(),
    }),
});