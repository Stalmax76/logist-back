import { db } from '../../config/db.ts';

import type { CreateRouteDto, UpdateRouteDto } from './routes.schema.ts';
import type { User } from '../users/user.types.ts';

// ======== helpers ========
async function carExists(car_id: number) {
	const [rows]: any = await db.query('SELECT * FROM cars WHERE id = ?', [car_id]);
	return rows.length > 0;
}

async function driverExists(driver_id: number) {
	const [rows]: any = await db.query('SELECT * FROM users WHERE id = ? AND role = "driver"', [
		driver_id,
	]);
	return rows.length > 0;
}
async function isCarBusy(date: string, car_id: number, excludeId?: number) {
	const [rows]: any = await db.query(
		`SELECT id FROM routes 
         WHERE date = ? AND car_id = ? AND status != 'deleted' AND id != ?`,
		[date, car_id, excludeId ?? 0]
	);
	return rows.length > 0;
}

async function isDriverBusy(date: string, driver_id: number, excludeId?: number) {
	const [rows]: any = await db.query(
		`SELECT id from routes
		WHERE date = ? AND driver_id = ? AND status != 'deleted' AND id != ?`,
		[date, driver_id, excludeId ?? 0]
	);
	return rows.length > 0;
}

export async function addRoute(data: CreateRouteDto, user: User) {
	if (user.role !== 'manager' && user.role !== 'admin') {
		throw new Error('You are not allowed to add a route');
	}

	if (!(await carExists(data.car_id))) throw new Error('This car does not exist');
	if (!(await driverExists(data.driver_id))) throw new Error('This driver does not exist');

	if (await isDriverBusy(data.date, data.driver_id)) {
		throw new Error('The driver already has a route for this day');
	}

	if (await isCarBusy(data.date, data.car_id)) {
		throw new Error('The car already has a route for this day');
	}

	const [result]: any = await db.query(
		`INSERT INTO routes 
        (date, car_id, driver_id, start_location, end_location, route_number, planned_km, planned_hours, helper_name, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			data.date,
			data.car_id,
			data.driver_id,
			data.start_location,
			data.end_location,
			data.route_number,
			data.planned_km ?? 0,
			data.planned_hours ?? 0,
			data.helper_name ?? null,
			data.status ?? 'planned',
		]
	);

	return getRouteById(result.insertId);
}

export async function getAllRoutes() {
	const [rows]: any = await db.query(
		'SELECT * FROM routes WHERE status != "deleted" ORDER BY date DESC LIMIT 100'
	);
	return rows;
}

export async function getRouteById(id: number) {
	const [rows]: any = await db.query('SELECT * FROM routes WHERE id = ? LIMIT 1', [id]);
	return rows[0];
}

export async function getRoutesByDriver(driverId: number) {
	const [rows]: any = await db.query(
		'SELECT * FROM routes WHERE driver_id = ? AND status != "deleted" ORDER BY date DESC LIMIT 100',
		[driverId]
	);
	return rows;
}

// =============== UPDATE ROUTE ================

export async function updateRouteById(id: number, data: UpdateRouteDto, user: User) {
	const route = await getRouteById(id);
	if (!route) throw new Error('the Route is not found');

	// Driver can only update his own routes
	if (user.role === 'driver' && route.driver_id !== user.id) {
		throw new Error('You can only update your own routes');
	}

	// Driver cannot update approved/cancelled/deleted routes
	if (user.role === 'driver' && ['approved', 'cancelled', 'deleted'].includes(route.status)) {
		throw new Error('This route is already ' + route.status);
	}

	// Driver can only update actual_km, actual_hours, notes, helper_name and status
	const driverAllowedFields = ['actual_km', 'actual_hours', 'notes', 'helper_name', 'status'];

	if (user.role === 'driver') {
		for (const key of Object.keys(data)) {
			if (!driverAllowedFields.includes(key)) {
				throw new Error(`The Driver cannot update this field: ${key}`);
			}
		}
	}

	// Driver can write only in_progress or completed
	if (user.role === 'driver' && data.status) {
		if (!['in_progress', 'completed'].includes(data.status)) {
			throw new Error('The Driver cannot write this status');
		}
	}

	// Driver changes factual fields
	const factualFields = ['actual_km', 'actual_hours', 'notes', 'helper_name'];
	const driverChangedFactual =
		user.role === 'driver' && factualFields.some((f) => (data as any)[f] !== undefined);

	if (driverChangedFactual) {
		data.status = 'pending_approval';
	}
	// completed has priority over pending_approval so we not need to check it
	// if (user.role === 'driver' && data.status === 'completed') {
	// }

	// Manager cannot delete route
	if (user.role === 'manager' && data.status === 'deleted') {
		throw new Error('The Manager cannot delete route');
	}

	// checking if driver is busy
	const newDate = data.date ?? route.date;
	const newCar = data.car_id ?? route.car_id;
	const newDriver = data.driver_id ?? route.driver_id;

	if (await isDriverBusy(newDate, newDriver, id)) {
		throw new Error('The driver already has a route for this day');
	}

	if (await isCarBusy(newDate, newCar, id)) {
		throw new Error('The car already has a route for this day');
	}

	// make SQL query
	const fields = Object.entries(data)
		.filter(([_, value]) => value !== undefined)
		.map(([key]) => `${key} = ?`)
		.join(', ');

	const values = Object.values(data).filter((v) => v !== undefined);

	if (fields.length === 0) return route;

	await db.query(`UPDATE routes SET ${fields} WHERE id = ?`, [...values, id]);

	return getRouteById(id);
}

/* ----------------------------- STATUS UPDATE ----------------------------- */

export async function updateRouteStatus(id: number, status: string, user: User) {
	const route = await getRouteById(id);
	if (!route) throw new Error('The route not found');

	// Permission checks
	if (user.role === 'driver') {
		// Driver can only update their own routes
		if (route.driver_id !== user.id) {
			throw new Error('You can only update your own routes');
		}

		// Driver can only set in_progress or completed
		if (!['in_progress', 'completed'].includes(status)) {
			throw new Error('You can only set status to in_progress or completed');
		}

		// Driver cannot update approved, cancelled, or deleted routes
		if (['approved', 'cancelled', 'deleted'].includes(route.status)) {
			throw new Error('This route is already ' + route.status);
		}
	}

	if (user.role === 'manager' || user.role === 'admin') {
		// Manager/Admin can approve completed/pending_approval routes
		if (status === 'approved') {
			if (!['completed', 'pending_approval'].includes(route.status)) {
				throw new Error('Can only approve completed or pending_approval routes');
			}
		}
	}

	await db.query(`UPDATE routes SET status = ? WHERE id = ?`, [status, id]);

	return getRouteById(id);
}

/* ----------------------------- APPROVE / CANCEL ----------------------------- */

export async function approveRoute(id: number, user: User) {
	if (user.role !== 'manager' && user.role !== 'admin') {
		throw new Error('You are not allowed to approve this route');
	}

	const route = await getRouteById(id);
	if (!route) throw new Error('The route not found');

	if (route.status === 'deleted') throw new Error('The route is already deleted');
	if (route.status === 'approved') throw new Error('The route is already approved');

	if (!['completed', 'pending_approval'].includes(route.status)) {
		throw new Error('Can only approve completed or pending_approval routes');
	}

	await db.query(`UPDATE routes SET status = 'approved' WHERE id = ?`, [id]);

	return getRouteById(id);
}

export async function cancelRoute(id: number, user: User) {
	if (user.role !== 'manager' && user.role !== 'admin') {
		throw new Error('you are not allowed to cancel this route');
	}

	const route = await getRouteById(id);
	if (!route) throw new Error('The route not found');

	if (route.status === 'deleted') throw new Error('The route is deleted');

	await db.query(`UPDATE routes SET status = 'cancelled' WHERE id = ?`, [id]);

	return getRouteById(id);
}

/* ----------------------------- DELETE ----------------------------- */

export async function deleteRouteById(id: number, user: User) {
	if (user.role !== 'admin') {
		throw new Error('You are not allowed to delete this route');
	}

	const route = await getRouteById(id);
	if (!route) throw new Error('The route not found');

	await db.query(`UPDATE routes SET status = 'deleted' WHERE id = ?`, [id]);

	return getRouteById(id);
}
