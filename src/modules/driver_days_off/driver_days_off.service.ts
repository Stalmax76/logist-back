import { db } from '../../config/db.ts';

import type { DriverDaysOffQuery } from './driver_days_off.schema.ts';
import type { DriverDayOff } from './driver_days_off.types.ts';

interface RouteRow {
	date: string;
}

export class DriverDaysOffService {
	async getDaysOff(
		query: DriverDaysOffQuery
	): Promise<{ days: DriverDayOff[]; stats: { type: string; count: number }[] }> {
		const { driverId, from, to } = query;

		// 1. manual records
		const [rows] = await db.query(
			`
            SELECT 
                id,
                driver_id AS driverId,
                date,
                type,
                notes,
                created_at AS createdAt
            FROM driver_days_off
            WHERE driver_id = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC
            `,
			[driverId, from, to]
		);

		const manualRecords = rows as DriverDayOff[];
		const existingDates = new Set(manualRecords.map((r) => r.date));

		// 2. Date when driver worked
		const [routeRows] = await db.query(
			`
            SELECT DISTINCT date
            FROM routes
            WHERE driver_id = ? AND date BETWEEN ? AND ?
            `,
			[driverId, from, to]
		);

		const workedDates = new Set((routeRows as RouteRow[]).map((r) => r.date));

		// 3. Generate weekends
		const weekends = this.generateWeekends(from, to, existingDates, workedDates);

		// 4. Generate absents
		const absents = this.generateAbsents(from, to, existingDates, workedDates);
		// 5. Generate worked
		const worked = this.generateWorked(from, to, existingDates, workedDates);

		// 6. Merge
		const all = [...manualRecords, ...weekends, ...absents, ...worked];

		// 7. Sort by date
		all.sort((a, b) => a.date.localeCompare(b.date));

		// 8. Stats
		const statsMap: Record<string, number> = {
			worked: 0,
			weekend: 0,
			absent: 0,
			vacation: 0,
			sick: 0,
			other: 0,
		};

		for (const day of all) {
			if (statsMap[day.type] !== undefined) {
				statsMap[day.type]++;
			} else {
				statsMap.other++;
			}
		}
		const stats = Object.entries(statsMap).map(([type, count]) => ({ type, count }));

		return { days: all, stats };
	}

	// --- Generate weekends ---
	private generateWeekends(
		from: string,
		to: string,
		existingDates: Set<string>,
		workedDates: Set<string>
	): DriverDayOff[] {
		const weekends: DriverDayOff[] = [];
		let current = new Date(from);
		const end = new Date(to);

		while (current <= end) {
			const day = current.getDay(); // 0 = Sunday, 6 = Saturday
			const iso = current.toISOString().slice(0, 10);

			if (!existingDates.has(iso) && !workedDates.has(iso) && (day === 0 || day === 6)) {
				weekends.push({
					id: 0,
					driverId: 0,
					date: iso,
					type: 'weekend',
					notes: undefined,
					createdAt: '',
				});
			}

			current.setDate(current.getDate() + 1);
		}

		return weekends;
	}

	// --- Generate absents ---
	private generateAbsents(
		from: string,
		to: string,
		existingDates: Set<string>,
		workedDates: Set<string>
	): DriverDayOff[] {
		const absents: DriverDayOff[] = [];

		let current = new Date(from);
		const end = new Date(to);

		while (current <= end) {
			const day = current.getDay(); // 1–5 = workdays
			const iso = current.toISOString().slice(0, 10);

			const isWorkday = day >= 1 && day <= 5;
			const hasManual = existingDates.has(iso);
			const hasWorked = workedDates.has(iso);

			if (isWorkday && !hasManual && !hasWorked) {
				absents.push({
					id: 0,
					driverId: 0,
					date: iso,
					type: 'absent',
					notes: undefined,
					createdAt: '',
				});
			}

			current.setDate(current.getDate() + 1);
		}

		return absents;
	}
	// Generate worked days
	private generateWorked(
		from: string,
		to: string,
		existingDates: Set<string>,
		workedDates: Set<string>
	): DriverDayOff[] {
		const worked: DriverDayOff[] = [];

		let current = new Date(from);
		const end = new Date(to);

		while (current <= end) {
			const iso = current.toISOString().slice(0, 10);
			const day = current.getDay();
			const isWeekend = day === 0 || day === 6;

			const hasManual = existingDates.has(iso);
			const hasWorked = workedDates.has(iso);

			if (!hasManual && hasWorked && !isWeekend) {
				worked.push({
					id: 0,
					driverId: 0,
					date: iso,
					type: 'worked',
					notes: undefined,
					createdAt: '',
				});
			}

			current.setDate(current.getDate() + 1);
		}
		return worked;
	}
}

export const driverDaysOffService = new DriverDaysOffService();
