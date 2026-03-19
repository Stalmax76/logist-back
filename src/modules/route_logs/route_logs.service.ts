import { db } from '../../config/db.ts';
import type { CreateRouteLogDto, UpdateRouteLogDto } from './route_logs.schema.ts';

export async function createRouteLog(data: CreateRouteLogDto) {
	const [result]: any = await db.query(
		'INSERT INTO route_logs (route_id, user_id, user_role, action, before_data, after_data, status_before, status_after, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[
			data.route_id,
			data.user_id,
			data.user_role,
			data.action,
			JSON.stringify(data.before_data ?? null),
			JSON.stringify(data.after_data ?? null),

			data.status_before ?? null,
			data.status_after ?? null,
			data.comment ?? null,
		]
	);

	return getRouteLogById(result.insertId);
}
export async function getRouteLogById(id: number) {
	const [rows]: any = await db.query('SELECT * FROM route_logs WHERE id = ?', [id]);
	if (!rows[0]) return null;

	return {
		...rows[0],
		before_data: rows[0].before_data ?? null,
		after_data: rows[0].after_data ?? null,
	};
}

export async function getRouteLogByRoute(route_id: number) {
	const [rows]: any = await db.query(
		'SELECT * FROM route_logs WHERE route_id = ? ORDER BY created_at DESC',
		[route_id]
	);
	return rows.map((row: any) => ({
		...row,
		before_data: row.before_data ?? null,
		after_data: row.after_data ?? null,
	}));
}

export async function updateRouteLogById(id: number, data: UpdateRouteLogDto) {
	const existing = await getRouteLogById(id);
	if (!existing) throw new Error('Route Log not found');

	const entries = Object.entries(data).filter(([_, value]) => value !== undefined);
	if (entries.length === 0) return existing;

	const fields = entries.map(([key]) => `${key} = ?`).join(', ');
	const values = entries.map(([key, value]) =>
		key === 'before_data' || key === 'after_data' ? JSON.stringify(value) : value
	);

	await db.query(`UPDATE route_logs SET ${fields} WHERE id = ?`, [...values, id]);

	return getRouteLogById(id);
}

export async function updateRouteLogStatus(id: number, status: string) {
	const existing = await getRouteLogById(id);
	if (!existing) throw new Error('Route log not found');

	await db.query(`UPDATE route_logs SET status_after = ? WHERE id = ?`, [status, id]);

	return getRouteLogById(id);
}
