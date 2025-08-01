import { z } from 'zod';

export const testPatternSchema = z.object({
    body: z.object({
        pattern: z.string(),
        testString: z.string(),
        flavor: z.enum(['javascript', 'python']),
        flags: z.string(),
    }),
});

export const savePatternSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Pattern name is required.'),
        pattern: z.string().min(1, 'A regex pattern is required.'),
        flags: z.string().optional(),
    }),
});