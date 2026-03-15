import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { db } from '../../config/db.ts';
import type { CreateUserDto, UpdateUserDto } from './users.schema.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// get one user by email
export async function getUserByEmail(email: string) {
	const [rows]: any = await db.query('SELECT * FROM users WHERE email = ?  LIMIT 1', [email]);

	return rows[0];
}

export async function loginUser(email: string, password: string) {
	const user = await getUserByEmail(email);
	if (!user) {
		throw new Error('User not found');
	}
	if (user.deleted_at !== null || user.is_active === 0) {
		throw new Error('User is deactivated');
	}
	// console.log('LOGIN DEBUG:', { password, hash: user.password_hash });
	const isValid = await bcrypt.compare(password, user.password_hash);

	if (!isValid) {
		throw new Error('Invalid password');
	}

	const token = jwt.sign(
		{
			id: user.id,
			role: user.role,
			email: user.email,
		},
		JWT_SECRET,
		{ expiresIn: '7d' }
	);
	return {
		message: 'Login successful',
		token,
		user: {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			phone: user.phone,
			email: user.email,
			role: user.role,
			is_active: user.is_active,
			created_at: user.created_at,
			updated_at: user.updated_at,
		},
	};
}

// request password reset
export async function requestPasswordReset(email?: string, phone?: string) {
	let user = null;

	if (email) user = await getUserByEmail(email);
	if (!user && phone) user = await getUserByPhone(phone);

	if (!user) {
		throw new Error('User not found');
	}

	const resetToken = randomBytes(32).toString('hex');
	const resetExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

	await db.query(`UPDATE users SET reset_token=?, reset_expires=? WHERE id=?`, [
		resetToken,
		resetExpires,
		user.id,
	]);

	return { resetToken };
}

export async function resetPassword(token: string, newPassword: string) {
	const [rows]: any = await db.query(
		`SELECT * FROM users WHERE reset_token=? AND reset_expires > NOW() AND deleted_at IS NULL AND is_active = 1 LIMIT 1`,
		[token]
	);

	const user = rows[0];

	if (!user) {
		throw new Error('Invalid or expired token');
	}

	const hash = await bcrypt.hash(newPassword, 10);

	await db.query(
		`UPDATE users SET password_hash=?, reset_token=NULL, reset_expires=NULL WHERE id=?`,
		[hash, user.id]
	);

	return { message: 'Password reset successfully' };
}

// create user
export async function addUser(data: CreateUserDto) {
	const existingEmail = await getUserByEmail(data.email);

	if (existingEmail) {
		throw new Error('Email already exists');
	}

	if (data.phone) {
		const existingPhone = await getUserByPhone(data.phone);
		if (existingPhone) {
			throw new Error('Phone already exists');
		}
	}
	// хешуємо пароль
	const password_hash = await bcrypt.hash(data.password, 10);
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

	return await getUser(result.insertId);
}

// get all users
export async function getAllUsers() {
	const [rows]: any = await db.query(
		'SELECT id, first_name, last_name, phone, email, role, is_active, created_at, updated_at, deleted_at FROM users WHERE deleted_at IS NULL'
	);
	return rows;
}

// get one user by id
export async function getUser(id: number) {
	const [rows]: any = await db.query(
		'SELECT id, first_name, last_name, phone, email, role, is_active, created_at, updated_at, deleted_at FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1',
		[id]
	);
	return rows[0];
}

// get one user by phone
export async function getUserByPhone(phone: string) {
	const [rows]: any = await db.query(
		'SELECT * FROM users WHERE phone = ? AND deleted_at IS NULL LIMIT 1',
		[phone]
	);

	return rows[0] || null;
}

// update user(partial)
export async function updateUserById(id: number, data: UpdateUserDto) {
	const currentUser = await getUser(id);
	if (!currentUser) {
		throw new Error('User not found');
	}

	if (data.email && data.email !== currentUser.email) {
		const existingEmail = await getUserByEmail(data.email);
		if (existingEmail && existingEmail.id !== id) {
			throw new Error('Email already exists');
		}
	}

	if (data.phone && data.phone !== currentUser.phone) {
		const existingPhone = await getUserByPhone(data.phone);
		if (existingPhone && existingPhone.id !== id) {
			throw new Error('Phone already exists');
		}
	}

	const fields: string[] = [];
	const values: any[] = [];

	for (const [key, value] of Object.entries(data)) {
		if (value === undefined) continue;

		if (key === 'password' && typeof value === 'string') {
			const hash = await bcrypt.hash(value, 10);
			fields.push(`password_hash = ?`);
			values.push(hash);
			continue;
		}

		fields.push(`${key} = ?`);
		values.push(value);
	}

	if (fields.length === 0) return getUser(id);

	values.push(id);

	await db.query(
		`UPDATE users SET ${fields.join(', ')} WHERE id=? AND deleted_at IS NULL LIMIT 1`,
		values
	);
	return getUser(id);
}

// deactivate user
export async function deactivateUserById(id: number) {
	await db.query(
		`UPDATE users SET is_active = 0, deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
		[id]
	);
	return getUser(id);
}

// activate user
export async function activateUserById(id: number) {
	await db.query(`UPDATE users SET is_active = 1, deleted_at = NULL WHERE id = ? LIMIT 1`, [id]);
	return getUser(id);
}
