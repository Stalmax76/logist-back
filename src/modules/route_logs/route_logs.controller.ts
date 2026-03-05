import { Request, Response } from 'express';
import {
	createRouteLog,
	getRouteLogByRoute,
	updateRouteLogById,
	updateRouteLogStatus,
} from './route_logs.service';

export async function addRouteLog(req: Request, res: Response) {
	try {
		const log = await createRouteLog(req.body);
		res.status(201).json(log);
	} catch (error) {
		console.error('Error creating route log:', error);
		res.status(500).json({ error: 'Failed to create route log' });
	}
}

export async function getRouteLog(req: Request, res: Response) {
	try {
		const log = await getRouteLogByRoute(Number(req.params.route_id));
		res.json(log);
	} catch (error) {
		console.error('Error fetching route log:', error);
		res.status(500).json({ error: 'Failed to fetch route log' });
	}
}
export async function editRouteLog(req: Request, res: Response) {
	try {
		await updateRouteLogById(Number(req.params.id), req.body);
		res.json({ message: 'Route log updated' });
	} catch (err) {
		console.error('Error updating route log:', err);
		res.status(500).json({ error: 'Failed to update route log' });
	}
}

export async function changeRouteLogStatus(req: Request, res: Response) {
	try {
		await updateRouteLogStatus(Number(req.params.id), req.body.status);
		res.json({ message: 'Status updated' });
	} catch (err) {
		console.error('Error updating status:', err);
		res.status(500).json({ error: 'Failed to update status' });
	}
}
