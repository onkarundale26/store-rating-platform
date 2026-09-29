import express from 'express';
import { signup, login, changePassword } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { signupSchema, loginSchema, changePasswordSchema } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.put('/password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
