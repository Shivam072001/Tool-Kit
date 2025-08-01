import { z } from 'zod';

export const savePaletteSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Palette name is required.'),
        colors: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)),
    }),
});