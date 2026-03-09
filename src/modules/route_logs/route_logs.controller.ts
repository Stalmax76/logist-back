import type { Request, Response } from 'express';
import {
	createRouteLog,
	getRouteLogById,
	getRouteLogByRoute,
	updateRouteLogById,
	updateRouteLogStatus,
} from './route_logs.service.ts';

export async function addRouteLog(req: Request, res: Response) {
	try {
		const log = await createRouteLog(req.body);
		return res.status(201).json(log);
	} catch (error) {
		console.error('Error creating route log:', error);
		return res.status(500).json({ error: 'Failed to create route log' });
	}
}

export async function getRouteLog(req: Request, res: Response) {
	try {
		const routeId = Number(req.params.route_id);
		const logs = await getRouteLogByRoute(routeId);

		return res.json(logs);
	} catch (error) {
		console.error('Error fetching route log:', error);
		return res.status(500).json({ error: 'Failed to fetch route log' });
	}
}

export async function editRouteLog(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const updated = await updateRouteLogById(id, req.body);

		return res.json(updated);
	} catch (error: any) {
		if (error.message === 'Route log not found') {
			return res.status(404).json({ error: 'Route log not found' });
		}

		console.error('Error updating route log:', error);
		return res.status(500).json({ error: 'Failed to update route log' });
	}
}

export async function changeRouteLogStatus(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const { status } = req.body;

		const updated = await updateRouteLogStatus(id, status);

		return res.json(updated);
	} catch (error: any) {
		if (error.message === 'Route log not found') {
			return res.status(404).json({ error: 'Route log not found' });
		}

		console.error('Error updating status:', error);
		return res.status(500).json({ error: 'Failed to update status' });
	}
}
export async function getRouteLogByIdController(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const log = await getRouteLogById(id);

		if (!log) {
			return res.status(404).json({ error: 'Route log not found' });
		}

		return res.json(log);
	} catch (error) {
		console.error('Error fetching route log by ID:', error);
		return res.status(500).json({ error: 'Failed to fetch route log' });
	}
}
