import { z } from 'zod';

const customSchemaField = z.object({
    fieldName: z.string(),
    fieldType: z.string(),
});

export const generateFakeDataSchema = z.object({
    body: z.object({
        type: z.enum(['personal', 'business', 'finance', 'custom']),
        count: z.number().int().positive().min(1).max(500),
        locale: z.string(),
        customSchema: z.array(customSchemaField).optional(),
    }),
});