import { db } from '../../config/db.ts';
import { getRoute } from './routes.controller.ts';

import type { CreateRouteDto, UpdateRouteDto } from './routes.schema.ts';

export async function addRoute(data: CreateRouteDto) {
	try {
		const [result]: any = await db.query(
			`INSERT INTO routes 
     (date, car_id, driver_id, start_location, end_location, route_number, planned_km, planned_hours, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				data.date,
				data.car_id,
				data.driver_id,
				data.start_location,
				data.end_location,
				data.route_number,
				data.planned_km ?? 0,
				data.planned_hours ?? 0,
				data.status,
			]
		);

		return getRouteById(result.insertId);
	} catch (error) {
		console.error('DB error:', error);
		throw error;
	}
}

export async function getAllRoutes() {
	const [rows]: any = await db.query('SELECT * FROM routes ORDER BY date DESC');
	return rows;
}

export async function getRouteById(id: number) {
	const [rows]: any = await db.query('SELECT * FROM routes WHERE id = ?', [id]);
	return rows[0];
}

export async function getRoutesByDriver(driverId: number) {
	const [rows]: any = await db.query(
		'SELECT * FROM routes WHERE driver_id = ? ORDER BY date DESC',
		[driverId]
	);
	return rows;
}

export async function updateRouteById(id: number, data: UpdateRouteDto) {
	// Перевіряємо, чи існує маршрут
	const existing = await getRouteById(id);
	if (!existing) {
		throw new Error('Route not found');
	}

	// Формуємо динамічний SQL тільки з тих полів, які передані
	const fields = Object.entries(data)
		.filter(([_, value]) => value !== undefined)
		.map(([key]) => `${key} = ?`)
		.join(', ');

	const values = Object.values(data).filter((v) => v !== undefined);

	if (fields.length === 0) return existing;

	await db.query(`UPDATE routes SET ${fields} WHERE id = ?`, [...values, id]);

	return getRouteById(id);
}

export async function updateRouteStatus(id: number, status: string) {
	const existing = await getRouteById(id);
	if (!existing) throw new Error('Route not found');

	await db.query(`UPDATE routes SET status=? WHERE id=?`, [status, id]);

	return getRouteById(id);
}
export async function deleteRouteById(id: number) {
	const existing = await getRouteById(id);
	if (!existing) throw new Error('Route not found');

	await db.query(`UPDATE routes SET status='deleted' WHERE id=?`, [id]);

	return getRouteById(id);
}

// export async function getRoutesByDate(date: string) {
// 	const [rows]: any = await db.query('SELECT * FROM routes WHERE date = ?', [date]);
// 	return rows;
// }
