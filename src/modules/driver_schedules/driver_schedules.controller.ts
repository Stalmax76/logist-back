import type { Request, Response } from 'express';
import {
	addDriverSchedule,
	getDriverScheduleById,
	getDriverSchedulesByDriver,
	updateDriverSchedule,
	deleteDriverSchedule,
} from './driver_schedules.service.ts';
import { getUser } from '../users/users.service.ts';

import {
	createDriverScheduleSchema,
	updateDriverScheduleSchema,
} from './driver_schedules.schema.ts';

export async function createSchedule(req: Request, res: Response) {
	try {
		// validate input
		const parsed = createDriverScheduleSchema.parse(req.body);
		const driver = await getUser(parsed.driver_id);
		if (!driver) {
			return res.status(404).json({ error: 'Driver does not exist' });
		}

		const schedule = await addDriverSchedule(parsed);
		res.status(201).json(schedule);
	} catch (error: any) {
		if (error.name === 'ZodError') {
			return res.status(400).json({ error: error.errors });
		}
		console.error('Error creating driver schedule:', error);
		res.status(500).json({ error: 'Failed to create driver schedule' });
		console.error(error);
	}
}

// Get By ID

export async function getDriverSchedule(req: Request, res: Response) {
	try {
		const schedule = await getDriverScheduleById(Number(req.params.id));

		if (!schedule) {
			return res.status(404).json({ error: 'Driver schedule not found' });
		}
		res.json(schedule);
	} catch (error) {
		console.error('Error fetching driver schedule:', error);
		res.status(500).json({ error: 'Failed to fetch driver schedule' });
	}
}

// Get By Driver
export async function getDriverSchedules(req: Request, res: Response) {
	try {
		const driverId = Number(req.params.driver_id);
		const { from, to } = req.query;

		const schedules = await getDriverSchedulesByDriver(
			driverId,
			from ? String(from) : undefined,
			to ? String(to) : undefined
		);
		res.json(schedules);
	} catch (error) {
		console.error('Error fetching driver schedules:', error);
		res.status(500).json({ error: 'Failed to fetch driver schedules' });
	}
}

// Update

export async function updateDriverScheduleHelper(req: Request, res: Response) {
	try {
		// validate input
		const parsed = updateDriverScheduleSchema.parse(req.body);

		await updateDriverSchedule(Number(req.params.id), parsed);
		res.json({ message: 'Driver schedule updated' });
	} catch (error: any) {
		if (error.name === 'ZodError') {
			return res.status(400).json({ error: error.errors });
		}
		console.error('Error updating driver schedule:', error);
		res.status(500).json({ error: 'Failed to update driver schedule' });
	}
}

// Delete
export async function removeDriverSchedule(req: Request, res: Response) {
	try {
		await deleteDriverSchedule(Number(req.params.id));
		res.json({ message: 'Driver schedule deleted' });
	} catch (error) {
		console.error('Error deleting driver schedule:', error);
		res.status(500).json({ error: 'Failed to delete driver schedule' });
	}
}

// export async function getWorkHoursStats(req: Request, res: Response) {
// 	const driverId = Number(req.params.driver_id);
// 	const { start_date, end_date } = req.query as { start_date: string; end_date: string };

// 	try {
// 		const stats = await getDriverWorkHoursStats(driverId, start_date, end_date);
// 		res.json(stats);
// 	} catch (error) {
// 		console.error('Get stats error:', error);
// 		res.status(500).json({ error: 'Internal server error' });
// 	}
// }

// export async function getCalendar(req: Request, res: Response) {
// 	const driverId = Number(req.params.driver_id);
// 	const { month, year } = req.query as { month: string; year: string };

// 	try {
// 		const calendar = await getCalendarData(driverId, month, year);
// 		res.json(calendar);
// 	} catch (error) {
// 		console.error('Get calendar error:', error);
// 		res.status(500).json({ error: 'Internal server error' });
// 	}
// }
