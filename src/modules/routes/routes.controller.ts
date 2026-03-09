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

export async function createRoute(req: Request, res: Response) {
	try {
		const route = await addRoute(req.body);
		return res.status(201).json(route);
	} catch (error) {
		console.error('Create route error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}

export async function getRoutes(req: Request, res: Response) {
	try {
		const routes = await getAllRoutes();
		return res.json(routes);
	} catch (error) {
		console.error('Get routes error:', error);
		return res.status(500).json({ error: 'Failed to fetch routes' });
	}
}

export async function getRoute(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const route = await getRouteById(id);

		if (!route) {
			return res.status(404).json({ error: 'Route not found' });
		}

		return res.json(route);
	} catch (error) {
		console.error('Get route error:', error);
		return res.status(500).json({ error: 'Failed to fetch route' });
	}
}

export async function getDriverRoutes(req: Request, res: Response) {
	try {
		const driverId = Number(req.params.driver_id);
		const routes = await getRoutesByDriver(driverId);
		return res.json(routes);
	} catch (error) {
		console.error('Get driver routes error:', error);
		return res.status(500).json({ error: 'Failed to fetch driver routes' });
	}
}

export async function updateRoute(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const updated = await updateRouteById(id, req.body);

		return res.json(updated);
	} catch (error: any) {
		if (error.message === 'Route not found') {
			return res.status(404).json({ error: 'Route not found' });
		}

		console.error('Update route error:', error);
		return res.status(500).json({ error: 'Failed to update route' });
	}
}

export async function changeStatus(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const { status } = req.body;

		const updated = await updateRouteStatus(id, status);

		return res.json(updated);
	} catch (error: any) {
		if (error.message === 'Route not found') {
			return res.status(404).json({ error: 'Route not found' });
		}

		console.error('Change status error:', error);
		return res.status(500).json({ error: 'Failed to update status' });
	}
}

export async function deleteRoute(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const deleted = await deleteRouteById(id);

		return res.json(deleted);
	} catch (error: any) {
		if (error.message === 'Route not found') {
			return res.status(404).json({ error: 'Route not found' });
		}

		console.error('Delete route error:', error);
		return res.status(500).json({ error: 'Failed to delete route' });
	}
}
