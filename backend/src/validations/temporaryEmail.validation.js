import { z } from 'zod';

export const updateForwardingSettingsSchema = z.object({
    body: z.object({
        forwardingAddress: z.string().email().optional(),
        forwardingEnabled: z.boolean(),
    }),
});