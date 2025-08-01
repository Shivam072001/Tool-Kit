import { z } from 'zod';

export const saveDiffSchema = z.object({
    body: z.object({
        originalText: z.string(),
        changedText: z.string(),
    }),
});