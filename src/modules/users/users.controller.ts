import { z } from 'zod';
import type { Request, Response } from 'express';
import {
	addUser,
	getAllUsers,
	getUser,
	updateUserById,
	deactivateUserById,
	activateUserById,
	loginUser,
	requestPasswordReset,
	resetPassword,
} from './users.service.ts';

import { createUserSchema, updateUserSchema } from './users.schema.ts';

// ----------------- CREATE USER -----------------
export async function createUser(req: Request, res: Response) {
	try {
		const parsed = createUserSchema.parse(req.body);
		const user = await addUser(parsed);
		res.status(201).json(user);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: error.message });
		}
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ----------------- GET ALL USERS -----------------
export async function getUsers(req: Request, res: Response) {
	try {
		const users = await getAllUsers();
		res.json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ----------------- GET USER BY ID -----------------
export async function getUserById(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) return res.status(400).json({ error: 'Invalid user id' });

		const user = await getUser(id);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ----------------- UPDATE USER -----------------
export async function updateUser(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

		// Валідація даних для оновлення (partial)
		const parsedData = updateUserSchema.parse(req.body);

		const updatedUser = await updateUserById(id, parsedData);
		if (!updatedUser) return res.status(404).json({ error: 'User not found' });

		res.json(updatedUser);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: error.issues });
		}
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ----------------- DEACTIVATE USER -----------------
export async function deactivateUser(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

		await deactivateUserById(id);

		res.json({ message: 'User deactivated successfully', user_id: id });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ----------------- ACTIVATE USER -----------------
export async function activateUser(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

		const user = await activateUserById(id);

		res.json({ message: 'User activated successfully', user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ----------------- LOGIN USER -----------------
export async function loginController(req: Request, res: Response) {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}
		const result = await loginUser(email, password);
		res.json(result);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
}

// ----------------- FORGOT PASSWORD -----------------
export async function forgotPasswordController(req: Request, res: Response) {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ error: 'Email is required' });

		const result = await requestPasswordReset(email);
		res.json(result);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
}

// ----------------- RESET PASSWORD -----------------
export async function resetPasswordController(req: Request, res: Response) {
	try {
		const { token, new_password } = req.body;
		if (!token || !new_password)
			return res.status(400).json({ error: 'Token and new password are required' });
		const result = await resetPassword(token, new_password);
		res.json(result);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
}
