import { Request, Response } from 'express';
import { addUser, getAllUsers, getUser, updateUserById, deactivateUserById } from './users.service';

export async function createUser(req: Request, res: Response) {
	try {
		const user = await addUser(req.body);
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
}
export async function getUsers(req: Request, res: Response) {
	const users = await getAllUsers();
	res.json(users);
}
export async function getUserById(req: Request, res: Response) {
	const id = Number(req.params.id);
	const user = await getUser(id);
	res.json(user);
}
export async function updateUser(req: Request, res: Response) {
	const id = Number(req.params.id);
	await updateUserById(id, req.body);
	res.json({ message: 'User updated' });
}
export async function deactivateUser(req: Request, res: Response) {
	const id = Number(req.params.id);
	await deactivateUserById(id);
	res.json({ message: 'User deactivated' });
}
