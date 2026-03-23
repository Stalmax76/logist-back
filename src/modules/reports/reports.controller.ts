import type { Request, Response } from 'express';
import type { ReportPeriod, ReportPeriodType } from '../../utills/date/period.ts';
import reportsService from './reports.service.ts';

class ReportsController {
	async getDriverReport(req: Request, res: Response) {
		try {
			// 1. get driver id
			const driverId = Number(req.query.driverId);
			if (!driverId) {
				return res.status(400).json({ error: 'driverId is required' });
			}
			if (isNaN(driverId) || driverId <= 0) {
				return res.status(400).json({ error: 'driverId must be a positive number' });
			}

			// 2. get period

			const allowedTypes = ['dayly', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'];

			const type = req.query.type as ReportPeriodType;
			if (!type) {
				return res.status(400).json({ error: 'period type is required' });
			}
			if (!allowedTypes.includes(type)) {
				return res.status(400).json({ error: `Invalid period type: ${type}` });
			}

			// 3. check dates
			if (!req.query.from || !req.query.to) {
				return res.status(400).json({ error: 'from and to are required' });
			}
			const from = new Date(req.query.from as string);
			const to = new Date(req.query.to as string);
			if (isNaN(from.getTime()) || isNaN(to.getTime())) {
				return res.status(400).json({ error: 'Invalid date format' });
			}
			if (from > to) {
				return res.status(400).json({ error: '"from" date cannot be greater than "to" date' });
			}

			// 4. create report period
			const period: ReportPeriod = {
				type,
				from: new Date(req.query.from as string),
				to: new Date(req.query.to as string),
			};

			// 5. get report
			const report = await reportsService.getDriverReport(driverId, period);

			// 6. return report
			return res.json(report);
		} catch (error) {
			console.error('Error in getDriverReport:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
}

export default new ReportsController();
