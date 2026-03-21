import type { Request, Response } from 'express';
import { driverDaysOffQuerySchema } from './driver_days_off.schema.ts';
import { driverDaysOffService } from './driver_days_off.service.ts';

class DriverDaysOffController {
	async getDaysOff(req: Request, res: Response) {
		try {
			// validate request
			const parsed = driverDaysOffQuerySchema.parse({
				driverId: req.params.driverId,
				from: req.query.from,
				to: req.query.to,
			});

			const result = await driverDaysOffService.getDaysOff(parsed);

			res.json({
				success: true,
				data: result,
			});
		} catch (error: any) {
			res.status(400).json({
				success: false,
				message: error.message,
			});
		}
	}
}

export const driverDaysOffController = new DriverDaysOffController();
