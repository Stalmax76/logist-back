import { z } from 'zod';
import type { Request, Response } from 'express';

import {
	addRoute,
	getAllRoutes,
	getRouteById,
	getRoutesByDriver,
	updateRouteById,
	updateRouteStatus,
	deleteRouteById,
} from './routes.service.ts';

import { createRouteSchema, updateRouteSchema } from './routes.schema.ts';

// ----------------- CREATE ROUTE -----------------
export async function createRoute(req: Request, res: Response) {
	try {
		const user = req.user;
		if (!user) return res.status(401).json({ error: 'Unauthorized' });

		const parsed = createRouteSchema.parse(req.body);
		const route = await addRoute(parsed, user);
		return res.status(201).json(route);
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: error.issues });
		}
		return res.status(400).json({ error: error.message });
	}
}

// ----------------- GET ROUTES -----------------
export async function getRoutes(req: Request, res: Response) {
	try {
		const routes = await getAllRoutes();
		return res.json(routes);
	} catch (error) {
		console.error('Get routes error:', error);
		return res.status(500).json({ error: 'Failed to fetch routes' });
	}
}

// ----------------- GET ROUTE BY ID -----------------
export async function getRouteByID(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) return res.status(400).json({ error: 'Invalid route id' });

		const route = await getRouteById(id);
		if (!route) {
			return res.status(404).json({ error: 'Route not found' });
		}

		return res.json(route);
	} catch (error: any) {
		console.error('Get route error:', error);
		return res.status(500).json({ error: 'Failed to fetch route' });
	}
}

// ----------------- GET DRIVER ROUTES -----------------
export async function getDriverRoutes(req: Request, res: Response) {
	try {
		const driverId = Number(req.params.driver_id);
		if (isNaN(driverId)) return res.status(400).json({ error: 'Invalid driver id' });

		const routes = await getRoutesByDriver(driverId);
		return res.json(routes);
	} catch (error) {
		console.error('Get driver routes error:', error);
		return res.status(500).json({ error: 'Failed to fetch driver routes' });
	}
}

// ----------------- UPDATE ROUTE -----------------
export async function updateRoute(req: Request, res: Response) {
	try {
		const user = req.user;
		if (!user) return res.status(401).json({ error: 'Unauthorized' });

		const id = Number(req.params.id);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid route id' });

		const parsed = updateRouteSchema.parse(req.body);
		const updated = await updateRouteById(id, parsed, user);

		return res.json(updated);
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: error.issues });
		}

		if (error.message === 'The route is not found') {
			return res.status(404).json({ error: 'Route not found' });
		}

		console.error('Update route error:', error);
		return res.status(400).json({ error: error.message });
	}
}

export async function changeStatus(req: Request, res: Response) {
	try {
		const user = req.user;
		if (!user) return res.status(401).json({ error: 'Unauthorized' });

		const id = Number(req.params.id);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid route id' });

		const { status } = req.body;
		if (!status) return res.status(400).json({ error: 'Status is required' });

		const updated = await updateRouteStatus(id, status, user);

		return res.json(updated);
	} catch (error: any) {
		if (error.message === 'The route not found') {
			return res.status(404).json({ error: 'Route not found' });
		}

		console.error('Change status error:', error);
		return res.status(400).json({ error: error.message });
	}
}

export async function deleteRoute(req: Request, res: Response) {
	try {
		const user = req.user;
		if (!user) return res.status(401).json({ error: 'Unauthorized' });

		const id = Number(req.params.id);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid route id' });

		const deleted = await deleteRouteById(id, user);

		return res.json(deleted);
	} catch (error: any) {
		if (error.message === 'The route not found') {
			return res.status(404).json({ error: 'Route not found' });
		}

		console.error('Delete route error:', error);
		return res.status(400).json({ error: error.message });
	}
}
