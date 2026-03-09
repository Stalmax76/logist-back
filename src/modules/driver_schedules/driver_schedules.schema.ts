import { z } from 'zod';

export const DriverScheduleTypeEnum = z.enum(['work', 'vacation', 'day_off', 'sick_leave']);
export const DriverScheduleStatusEnum = z.enum(['planned', 'confirmed', 'cancelled']);

export const createDriverScheduleSchema = z.object({
	driver_id: z.number().int().positive(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
	type: DriverScheduleTypeEnum,
	planned_hours: z.number().min(1).max(24).optional(),
	notes: z.string().nullable().optional(),
});
export const updateDriverScheduleSchema = z.object({
	type: DriverScheduleTypeEnum.optional(),
	planned_hours: z.number().min(0).max(24).optional(),
	actual_hours: z.number().min(0).max(24).optional(),
	status: DriverScheduleStatusEnum.optional(),
	notes: z.string().nullable().optional(),
});
