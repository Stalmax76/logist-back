import { Router } from 'express';
import {
	loginController,
	forgotPasswordController,
	resetPasswordController,
	changePasswordController,
} from './auth.controller.ts';

import {
	loginSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	changePasswordSchema,
} from './auth.schema.ts';

import { validate } from '../../middleware/validate.ts';
import { authMiddleware } from '../../middleware/auth.ts';

const router = Router();

router.post('/login', validate(loginSchema), loginController);

router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController);

router.post('/reset-password', validate(resetPasswordSchema), resetPasswordController);

router.post(
	'/change-password',
	authMiddleware,
	validate(changePasswordSchema),
	changePasswordController
);

export default router;
