import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { db } from '../../config/db.ts';
import { getUserByEmail, getUserByPhone, getUser } from '../users/users.service.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function loginService(email: string, password: string) {
	console.log(`email: ${email}, password: ${password}`);

	const user = await getUserByEmail(email);
	if (!user) throw new Error('User not found');
	if (user.deleted_at) throw new Error('User is deactivated');

	const valid = await bcrypt.compare(password, user.password_hash);
	if (!valid) throw new Error('Invalid password');

	const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
		expiresIn: '7d',
	});

	return { token, user };
}

export async function forgotPasswordService({ email, phone }: { email?: string; phone?: string }) {
	let user = null;

	if (email) user = await getUserByEmail(email);
	if (!user && phone) user = await getUserByPhone(phone);

	if (!user) throw new Error('User not found');

	const resetToken = randomBytes(32).toString('hex');
	const expires = new Date(Date.now() + 15 * 60 * 1000);

	await db.query(`UPDATE users SET reset_token=?, reset_expires=? WHERE id=? LIMIT 1`, [
		resetToken,
		expires,
		user.id,
	]);

	return { resetToken };
}

export async function resetPasswordService(token: string, newPassword: string) {
	const [rows]: any = await db.query(
		`SELECT * FROM users WHERE reset_token=? AND reset_expires > NOW() AND deleted_at IS NULL LIMIT 1`,
		[token]
	);

	const user = rows[0];
	if (!user) throw new Error('Invalid or expired token');

	const hash = await bcrypt.hash(newPassword, 10);

	await db.query(
		`UPDATE users SET password_hash=?, reset_token=NULL, reset_expires=NULL WHERE id=? AND deleted_at IS NULL LIMIT 1`,
		[hash, user.id]
	);

	return { message: 'Password reset successfully' };
}

export async function changePasswordService(userId: number, oldPass: string, newPass: string) {
	const user = await getUser(userId);
	if (!user) throw new Error('User not found');

	const valid = await bcrypt.compare(oldPass, user.password_hash);
	if (!valid) throw new Error('Old password is incorrect');

	const hash = await bcrypt.hash(newPass, 10);

	await db.query(`UPDATE users SET password_hash=? WHERE id=? AND deleted_at IS NULL`, [
		hash,
		userId,
	]);

	return { message: 'Password changed successfully' };
}
