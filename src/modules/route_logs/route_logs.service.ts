import { get } from 'node:http';
import { db } from '../../config/db.ts';
import type { CreateRouteLogDto, UpdateRouteLogDto } from './route_logs.schema.ts';

export async function createRouteLog(data: CreateRouteLogDto) {
	const [result]: any = await db.query(
		'INSERT INTO route_logs(route_id, user_id,start_time, end_time, actual_hours, distance_traveled, fuel_used, notes, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[
			data.route_id,
			data.user_id,
			data.start_time,
			data.end_time,
			data.actual_hours ?? null,
			data.distance_traveled ?? null,
			data.fuel_used ?? null,
			data.notes ?? null,
			data.status ?? 'draft',
		]
	);

	return getRouteLogById(result.insertId);
}
export async function getRouteLogById(id: number) {
	const [rows]: any = await db.query('SELECT * FROM route_logs WHERE id = ?', [id]);
	return rows[0] ?? null;
}

export async function getRouteLogByRoute(route_id: number) {
	const [rows]: any = await db.query(
		'SELECT * FROM route_logs WHERE route_id = ? ORDER BY created_at DESC',
		[route_id]
	);
	return rows;
}

export async function updateRouteLogById(id: number, data: UpdateRouteLogDto) {
	const existing = await getRouteLogById(id);
	if (!existing) throw new Error('Route Log not found');

	const fields = Object.entries(data)
		.filter(([_, value]) => value !== undefined)
		.map(([key]) => `${key} = ?`)
		.join(', ');

	const values = Object.values(data).filter((v) => v !== undefined);

	if (fields.length === 0) return existing;

	await db.query(`UPDATE route_logs SET ${fields} WHERE id = ?`, [...values, id]);

	return getRouteLogById(id);
}

export async function updateRouteLogStatus(id: number, status: string) {
	const existing = await getRouteLogById(id);
	if (!existing) throw new Error('Route log not found');

	await db.query(`UPDATE route_logs SET status = ? WHERE id = ?`, [status, id]);

	return getRouteLogById(id);
}
