import type { Request, Response } from 'express';
import {
	loginService,
	forgotPasswordService,
	resetPasswordService,
	changePasswordService,
} from './auth.service.ts';

export async function loginController(req: Request, res: Response) {
	try {
		const { email, password } = req.body;
		const result = await loginService(email, password);
		res.json(result);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}

export async function forgotPasswordController(req: Request, res: Response) {
	try {
		const { email, phone } = req.body;
		const result = await forgotPasswordService({ email, phone });
		res.json(result);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}

export async function resetPasswordController(req: Request, res: Response) {
	try {
		const { token, password } = req.body;
		const result = await resetPasswordService(token, password);
		res.json(result);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}

export async function changePasswordController(req: Request, res: Response) {
	try {
		const userId = req.user!.id;
		const { old_password, new_password } = req.body;

		const result = await changePasswordService(userId, old_password, new_password);
		res.json(result);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}
