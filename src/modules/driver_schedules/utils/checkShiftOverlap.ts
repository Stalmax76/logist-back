import { db } from '../../../config/db.ts';

export async function checkShiftOverlap(
	driver_id: number,
	date: string,
	start: string,
	end: string,
	excludeId?: number
): Promise<boolean> {
	let sql = `
        SELECT id, shift_start_time, shift_end_time
        FROM driver_schedules
        WHERE driver_id = ?
          AND date = ?
          AND is_active = 1
    `;

	const params: any[] = [driver_id, date];

	if (excludeId) {
		sql += ` AND id != ?`;
		params.push(excludeId);
	}

	const [rows]: any = await db.query(sql, params);

	const newStart = new Date(start).getTime();
	const newEnd = new Date(end).getTime();

	for (const row of rows) {
		if (!row.shift_start_time || !row.shift_end_time) continue;

		const existingStart = new Date(row.shift_start_time).getTime();
		const existingEnd = new Date(row.shift_end_time).getTime();

		// Перетин інтервалів:
		if (newStart < existingEnd && newEnd > existingStart) {
			return true;
		}
	}

	return false;
}
