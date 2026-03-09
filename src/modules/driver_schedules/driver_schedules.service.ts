import { db } from '../../config/db.ts';
import type {
	CreateDriverScheduleDto,
	UpdateDriverScheduleDto,
	DriverSchedule,
} from './driver_schedules.types.ts';

export async function addDriverSchedule(data: CreateDriverScheduleDto) {
	const [result]: any = await db.query(
		`INSERT INTO driver_schedules
    (driver_id, date, type, planned_hours, actual_hours, is_auto_generated, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			data.driver_id,
			data.date,
			data.type,
			data.planned_hours ?? 0,
			0,
			false,
			data.notes ?? null,
			'planned',
		]
	);
	const created = await getDriverScheduleById(result.insertId);
	return created!;
}

export async function getDriverScheduleById(id: number): Promise<DriverSchedule | null> {
	const [rows]: any = await db.query(`SELECT * FROM driver_schedules WHERE id = ?`, [id]);
	return rows[0] || null;
}

export async function getDriverSchedulesByDriver(
	driver_id: number,
	from?: string,
	to?: string
): Promise<DriverSchedule[]> {
	let sql = `SELECT * FROM driver_schedules WHERE driver_id = ?`;
	const params: any[] = [driver_id];

	if (from) {
		sql += ` AND date >= ?`;
		params.push(from);
	}
	if (to) {
		sql += ` AND date <= ?`;
		params.push(to);
	}

	sql += ` ORDER BY date ASC`;

	const [rows]: any = await db.query(sql, params);
	return rows;
}

export async function updateDriverSchedule(id: number, data: UpdateDriverScheduleDto) {
	const [result]: any = await db.query(`UPDATE driver_schedules SET ? WHERE id = ?`, [data, id]);
	return result;
}

export async function deleteDriverSchedule(id: number) {
	const [result]: any = await db.query(`DELETE FROM driver_schedules WHERE id = ?`, [id]);
	return result;
}
