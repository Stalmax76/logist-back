import type { Request, Response } from 'express';
import { z } from 'zod';
import {
	addUser,
	getAllUsers,
	getUser,
	updateUserById,
	deactivateUserById,
} from './users.service.ts';
import { createUserSchema, updateUserSchema } from './users.schema.ts';
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
export async function getUsers(req: Request, res: Response) {
	try {
		const users = await getAllUsers();
		res.json(users);
	} catch (error) {
		console.error(error);
	}
}

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
			return res.status(400).json({ error: error.issues[0].message });
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
