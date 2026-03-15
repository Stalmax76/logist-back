import { z } from 'zod';
import {
	createDriverScheduleSchema,
	updateDriverScheduleSchema,
	DriverScheduleStatusEnum,
	DriverScheduleTypeEnum,
	DriverScheduleSourceEnum,
} from './driver_schedules.schema.js';

export type CreateDriverScheduleDto = z.infer<typeof createDriverScheduleSchema>;
export type UpdateDriverScheduleDto = z.infer<typeof updateDriverScheduleSchema>;
export type DriverScheduleStatus = z.infer<typeof DriverScheduleStatusEnum>;
export type DriverScheduleType = z.infer<typeof DriverScheduleTypeEnum>;
export type DriverScheduleSource = z.infer<typeof DriverScheduleSourceEnum>;

export interface DriverSchedule {
	id: number;
	driver_id: number;
	date: string; // YYYY-MM-DD
	type: DriverScheduleType;
	planned_hours: number;
	shift_start_time: string | null;
	shift_end_time: string | null;
	actual_hours: number;
	overtime_hours: number;
	break_minutes: number;
	route_count: number;
	is_auto_generated: boolean;
	notes: string | null;
	status: DriverScheduleStatus;
	created_at: string;
	updated_at: string;
	created_by: number | null;
	updated_by: number | null;
	is_active: boolean;
	source: DriverScheduleSource;
}
