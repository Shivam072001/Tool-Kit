import { z } from 'zod';

/**
 * @param {z.ZodSchema<any>} schema
 */
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid input data.',
                errors: err.errors,
            });
        }
        next(err);
    }
};