import { db } from '../../config/db';
import type { RouteLog } from './route_logs.types';

export async function createRouteLog(data: RouteLog) {
	const [result]: any = await db.query(
		'INSERT INTO route_logs(route_id, user_id, actual_hours, distance_traveled, fuel_used, notes, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
		[
			data.route_id,
			data.user_id,
			data.actual_hours ?? null,
			data.distance_traveled ?? null,
			data.fuel_used ?? null,
			data.notes ?? null,
			data.status ?? 'draft',
		]
	);

	return { id: result.insertId, ...data };
}

export async function getRouteLogByRoute(route_id: number) {
	const [rows]: any = await db.query('SELECT * FROM route_logs WHERE route_id = ?', [route_id]);
	return rows[0] || null;
}

export async function updateRouteLogById(id: number, data: Partial<RouteLog>) {
	const [result]: any = await db.query('UPDATE route_logs SET ? WHERE id = ?', [data, id]);
	return result;
}

export async function updateRouteLogStatus(id: number, status: string) {
	const [result]: any = await db.query('UPDATE route_logs SET status = ? WHERE id = ?', [
		status,
		id,
	]);
	return result;
}
