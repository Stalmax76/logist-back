import { db } from '../../config/db.ts';
import type { RouteHelper } from './route_helpers.types.ts';
import type { CreateRouteHelperDto } from './route_helpers.schema.ts';

class RouteHelpersService {
	async add(data: CreateRouteHelperDto): Promise<RouteHelper> {
		const [result] = await db.execute(
			`INSERT INTO route_helpers (route_id, helper_id)
             VALUES (?, ?)`,
			[data.routeId, data.helperId]
		);

		const insertId = (result as any).insertId;

		return {
			id: insertId,
			routeId: data.routeId,
			helperId: data.helperId,
		};
	}

	async remove(routeId: number, helperId: number): Promise<void> {
		await db.execute(
			`DELETE FROM route_helpers
             WHERE route_id = ? AND helper_id = ?`,
			[routeId, helperId]
		);
	}

	async getHelpersByRoute(routeId: number): Promise<RouteHelper[]> {
		const [rows] = await db.execute(
			`SELECT id, route_id AS routeId, helper_id AS helperId
             FROM route_helpers
             WHERE route_id = ?`,
			[routeId]
		);

		return rows as RouteHelper[];
	}

	async getRoutesByHelper(helperId: number): Promise<RouteHelper[]> {
		const [rows] = await db.execute(
			`SELECT id, route_id AS routeId, helper_id AS helperId
             FROM route_helpers
             WHERE helper_id = ?`,
			[helperId]
		);

		return rows as RouteHelper[];
	}
}

export const routeHelpersService = new RouteHelpersService();
