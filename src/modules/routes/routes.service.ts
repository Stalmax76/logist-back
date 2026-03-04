import { db } from '../../config/db';
import type { Route } from './route.types';

export async function addRoute(data: Route) {
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
				data.status ?? 'planned',
			]
		);

		return { id: result.insertId, ...data };
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

export async function updateRouteById(id: number, data: Partial<Route>) {
	await db.query(
		`UPDATE routes 
     SET date=?, car_id=?, driver_id=?, start_location=?, end_location=?, route_number=?, planned_km=?, planned_hours=?, status=?
     WHERE id=?`,
		[
			data.date,
			data.car_id,
			data.driver_id,
			data.start_location,
			data.end_location,
			data.route_number,
			data.planned_km,
			data.planned_hours,
			data.status,
			id,
		]
	);
}

export async function updateRouteStatus(id: number, status: string) {
	await db.query(`UPDATE routes SET status=? WHERE id=?`, [status, id]);
}
