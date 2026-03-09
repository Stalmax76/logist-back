import { get } from 'node:http';
import { db } from '../../config/db.ts';

import type { User } from './user.types.ts';
import type { CreateUserDto, UpdateUserDto } from './users.schema.ts';
import { email } from 'zod';
import is from 'zod/v4/locales/is.js';

export async function addUser(data: CreateUserDto) {
	// хешуємо пароль
	const password_hash = 1234567890;
	const [result]: any = await db.query(
		`INSERT INTO users (first_name, last_name, phone, email, password_hash, role, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[
			data.first_name,
			data.last_name,
			data.phone || null,
			data.email,
			password_hash,
			data.role,
			data.is_active ?? true,
		]
	);

	return {
		id: result.insertId,
		first_name: data.first_name,
		last_name: data.last_name,
		phone: data.phone,
		email: data.email,
		role: data.role,
		is_active: data.is_active ?? true,
	};
}

export async function getAllUsers() {
	const [rows]: any = await db.query(
		'SELECT id, first_name, last_name, phone, email, role, is_active FROM users'
	);
	return rows;
}

export async function getUser(id: number) {
	const [rows]: any = await db.query('SELECT * FROM users WHERE id = ?', [id]);
	return rows[0];
}

export async function getUserByEmail(email: string) {
	const [rows]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);

	return rows[0];
}

export async function updateUserById(id: number, data: UpdateUserDto) {
	await db.query(
		`UPDATE users SET first_name=?, last_name=?, phone=?, email=?, role=?, is_active=? WHERE id=?`,
		[data.first_name, data.last_name, data.phone, data.email, data.role, data.is_active, id]
	);
	return getUser(id);
}

export async function deactivateUserById(id: number) {
	await db.query(`UPDATE users SET active = 0 WHERE id = ?`, [id]);
}
