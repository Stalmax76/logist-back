import { z } from 'zod';
import {
	createDriverScheduleSchema,
	updateDriverScheduleSchema,
	DriverScheduleStatusEnum,
	DriverScheduleTypeEnum,
} from './driver_schedules.schema.js';

export type CreateDriverScheduleDto = z.infer<typeof createDriverScheduleSchema>;
export type UpdateDriverScheduleDto = z.infer<typeof updateDriverScheduleSchema>;
export type DriverScheduleStatus = z.infer<typeof DriverScheduleStatusEnum>;
export type DriverScheduleType = z.infer<typeof DriverScheduleTypeEnum>;

export interface DriverSchedule {
	id: number;
	driver_id: number;
	date: string; // YYYY-MM-DD
	type: DriverScheduleType;
	planned_hours: number;
	actual_hours: number;
	notes: string | null;
	is_auto_generated: boolean;
	status: DriverScheduleStatus;
	created_at: string;
	updated_at: string;
}
