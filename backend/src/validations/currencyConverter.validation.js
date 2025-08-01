import { z } from 'zod';

export const saveConversionSchema = z.object({
    body: z.object({
        fromCurrency: z.string().length(3),
        toCurrency: z.string().length(3),
        amount: z.number(),
        result: z.number(),
    }),
});