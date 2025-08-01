import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';
const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export { router as authRoutes };