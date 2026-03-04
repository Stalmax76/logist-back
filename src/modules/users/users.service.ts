import { db } from '../../config/db';
import { User } from './user.types';

export async function addUser(data: User) {
	const [result]: any = await db.query(
		`INSERT INTO users (name, phone, email, password_hash, role, active)
     VALUES (?, ?, ?, ?, ?, ?)`,
		[
			data.name,
			data.phone || null,
			data.email || null,
			data.password_hash,
			data.role,
			data.active ?? true,
		]
	);

	return { id: result.insertId, ...data };
}

export async function getAllUsers() {
	const [rows]: any = await db.query('SELECT * FROM users');
	return rows;
}

export async function getUser(id: number) {
	const [rows]: any = await db.query('SELECT * FROM users WHERE id = ?', [id]);
	return rows[0];
}

export async function updateUserById(id: number, data: Partial<User>) {
	await db.query(`UPDATE users SET name=?, phone=?, email=?, role=?, active=? WHERE id=?`, [
		data.name,
		data.phone,
		data.email,
		data.role,
		data.active,
		id,
	]);
}

export async function deactivateUserById(id: number) {
	await db.query(`UPDATE users SET active = 0 WHERE id = ?`, [id]);
}
