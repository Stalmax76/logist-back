import { db } from '../../config/db.ts';
import type {
	CreateDriverScheduleDto,
	UpdateDriverScheduleDto,
	DriverSchedule,
} from './driver_schedules.types.ts';

import { validateShiftTimes } from './validators/scheduleTime.ts';
import { calculateHours } from './utils/calculateHours.ts';
import { checkShiftOverlap } from './utils/checkShiftOverlap.ts';

export async function addDriverSchedule(data: CreateDriverScheduleDto, user_id: number) {
	const isAuto = data.source === 'auto' || data.source === 'system';

	const status =
		data.type === 'vacation' || data.type === 'day_off' || data.type === 'sick_leave'
			? 'confirmed'
			: 'planned';

	// 1. Validate shift times (same as in controller)
	const timeCheck = validateShiftTimes(data.shift_start_time, data.shift_end_time);
	if (!timeCheck.valid) {
		throw new Error(timeCheck.message);
	}

	if (data.shift_start_time && data.shift_end_time) {
		const overlap = await checkShiftOverlap(
			data.driver_id,
			data.date,
			data.shift_start_time,
			data.shift_end_time
		);

		if (overlap) {
			throw new Error('Shift overlaps with an existing schedule');
		}
	}

	// 2. Calculate actual_hours and overtime_hours
	let actual_hours = 0;
	let overtime_hours = 0;

	if (data.shift_start_time && data.shift_end_time) {
		const { actual } = calculateHours(
			data.shift_start_time,
			data.shift_end_time,
			data.break_minutes ?? 0
		);

		actual_hours = actual;
		overtime_hours = Math.max(actual - (data.planned_hours ?? 0), 0);
	}

	const [result]: any = await db.query(
		`INSERT INTO driver_schedules
    (driver_id, date, type, planned_hours,shift_start_time,shift_end_time, actual_hours, overtime_hours,break_minutes, route_count, is_auto_generated, notes, status, created_by, updated_by, is_active, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			data.driver_id,
			data.date,
			data.type,
			data.planned_hours ?? 0,
			data.shift_start_time ?? null,
			data.shift_end_time ?? null,
			actual_hours,
			overtime_hours,
			data.break_minutes ?? 0,
			0,
			isAuto,
			data.notes ?? null,
			status,
			user_id,
			user_id,
			true,
			data.source ?? 'manual',
		]
	);

	return getDriverScheduleById(result.insertId);
}

export async function getDriverScheduleById(id: number): Promise<DriverSchedule | null> {
	const [rows]: any = await db.query(
		`SELECT * FROM driver_schedules WHERE id = ? AND is_active = 1 LIMIT 1`,
		[id]
	);
	return rows[0] || null;
}

export async function getDriverSchedulesByDriver(
	driver_id: number,
	from?: string,
	to?: string
): Promise<DriverSchedule[]> {
	let sql = `SELECT * FROM driver_schedules WHERE driver_id = ? AND is_active = 1`;
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

export async function updateDriverSchedule(
	id: number,
	data: UpdateDriverScheduleDto,
	user_id: number
) {
	const schedule = await getDriverScheduleById(id);

	if (!schedule) {
		throw new Error('Schedule not found');
	}

	const timeCheck = validateShiftTimes(data.shift_start_time, data.shift_end_time);
	if (!timeCheck.valid) {
		throw new Error(timeCheck.message);
	}

	// Check overlap
	if (data.shift_start_time && data.shift_end_time) {
		const overlap = await checkShiftOverlap(
			schedule.driver_id,
			schedule.date,
			data.shift_start_time,
			data.shift_end_time,
			id
		);

		if (overlap) {
			throw new Error('Shift overlaps with an existing schedule');
		}
	}

	let actual_hours = schedule.actual_hours;
	let overtime_hours = schedule.overtime_hours;

	if (data.shift_start_time && data.shift_end_time) {
		const { actual } = calculateHours(
			data.shift_start_time,
			data.shift_end_time,
			data.break_minutes ?? schedule.break_minutes ?? 0
		);

		actual_hours = actual;

		const planned = data.planned_hours ?? schedule.planned_hours ?? 0;

		overtime_hours = Math.max(actual - planned, 0);
	}

	const allowedFields = {
		type: data.type,
		planned_hours: data.planned_hours,
		actual_hours,
		overtime_hours,
		shift_start_time: data.shift_start_time,
		shift_end_time: data.shift_end_time,
		break_minutes: data.break_minutes,
		status: data.status,
		notes: data.notes,
		updated_by: user_id,
	};

	const cleanData = Object.fromEntries(
		Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
	);

	const [result]: any = await db.query(
		`UPDATE driver_schedules SET ? WHERE id = ? AND is_active = 1 LIMIT 1`,
		[cleanData, id]
	);
	return result;
}

export async function deleteDriverSchedule(id: number, user_id: number) {
	const [result]: any = await db.query(
		`UPDATE driver_schedules SET is_active = 0, updated_by = ?  WHERE id = ? AND is_active = 1 LIMIT 1`,
		[user_id, id]
	);
	return result;
}
