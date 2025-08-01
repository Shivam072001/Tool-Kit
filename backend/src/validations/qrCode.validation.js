import { z } from 'zod';

export const createQRCodeSchema = z.object({
    body: z.object({
        value: z.string().min(1, 'QR Code value cannot be empty.'),
        backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").optional(),
        foregroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").optional(),
        maxScans: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().positive().optional()),
    }),
});

export const enableQRCodeSchema = z.object({
    body: z.object({
        newMaxScans: z.preprocess((val) => Number(val), z.number().int().positive()),
    }),
});