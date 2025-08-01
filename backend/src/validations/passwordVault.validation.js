import { z } from 'zod';

export const saveVaultSchema = z.object({
    body: z.object({
        vaultData: z.string().min(1, 'Vault data cannot be empty.'),
    }),
});

export const checkPasswordBreachSchema = z.object({
    body: z.object({
        password: z.string().min(1, 'Password is required.'),
    }),
});