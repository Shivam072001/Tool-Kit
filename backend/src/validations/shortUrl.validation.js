import { z } from 'zod';

export const createShortUrlSchema = z.object({
    body: z.object({
        originalUrl: z.string().url('Invalid URL format.'),
        maxClicks: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().positive().optional()),
        expiresAt: z.string().optional(),
    }),
});

export const enableShortUrlSchema = z.object({
    body: z.object({
        newMaxClicks: z.preprocess((val) => Number(val), z.number().int().positive()),
    }),
});