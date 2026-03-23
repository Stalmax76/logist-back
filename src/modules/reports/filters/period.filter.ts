import type { ReportPeriod } from '../../../utills/date/period.ts';

import {
	startOfDay,
	endOfDay,
	startOfWeek,
	endOfWeek,
	startOfMonth,
	endOfMonth,
	startOfQuarter,
	endOfQuarter,
	startOfYear,
	endOfYear,
} from '../../../utills/date/ranges.ts';

export function resolvePeriod(period: ReportPeriod) {
	switch (period.type) {
		case 'daily':
			return {
				from: startOfDay(period.from),
				to: endOfDay(period.from),
			};

		case 'weekly':
			return {
				from: startOfWeek(period.from),
				to: endOfWeek(period.from),
			};

		case 'monthly':
			return {
				from: startOfMonth(period.from),
				to: endOfMonth(period.from),
			};

		case 'quarterly':
			return {
				from: startOfQuarter(period.from),
				to: endOfQuarter(period.from),
			};

		case 'yearly':
			return {
				from: startOfYear(period.from),
				to: endOfYear(period.from),
			};

		case 'custom':
			return {
				from: period.from,
				to: period.to,
			};

		default:
			throw new Error(`Unknown period type: ${period.type}`);
	}
}
