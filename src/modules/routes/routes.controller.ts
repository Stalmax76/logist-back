import { Request, Response } from 'express';
import {
	addRoute,
	getAllRoutes,
	getRouteById,
	getRoutesByDriver,
	updateRouteById,
	updateRouteStatus,
} from './routes.service';

export async function createRoute(req: Request, res: Response) {
	try {
		const route = await addRoute(req.body);
		res.json(route);
	} catch (error) {
		console.error('Create route error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

export async function getRoutes(req: Request, res: Response) {
	const routes = await getAllRoutes();
	res.json(routes);
}

export async function getRoute(req: Request, res: Response) {
	const id = Number(req.params.id);
	const route = await getRouteById(id);
	res.json(route);
}

export async function getDriverRoutes(req: Request, res: Response) {
	const driverId = Number(req.params.driver_id);
	const routes = await getRoutesByDriver(driverId);
	res.json(routes);
}

export async function updateRoute(req: Request, res: Response) {
	const id = Number(req.params.id);
	await updateRouteById(id, req.body);
	res.json({ message: 'Route updated' });
}

export async function changeStatus(req: Request, res: Response) {
	const id = Number(req.params.id);
	const { status } = req.body;

	await updateRouteStatus(id, status);
	res.json({ message: 'Status updated' });
}
