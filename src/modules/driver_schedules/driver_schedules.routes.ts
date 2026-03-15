import { Router } from 'express';
import {
	createSchedule,
	getDriverSchedule,
	getDriverSchedules,
	removeDriverSchedule,
	updateDriverScheduleHelper,
} from './driver_schedules.controller.ts';
import {
	updateDriverScheduleSchema,
	createDriverScheduleSchema,
} from './driver_schedules.schema.ts';
import { validate } from '../../middleware/validate.ts';
import { authMiddleware } from '../../middleware/auth.ts';

const router = Router();

router.post('/', authMiddleware, validate(createDriverScheduleSchema), createSchedule);
router.get('/driver/:driver_id', authMiddleware, getDriverSchedules);
router.get('/:id', authMiddleware, getDriverSchedule);
router.patch(
	'/:id',
	authMiddleware,
	validate(updateDriverScheduleSchema),
	updateDriverScheduleHelper
);
router.delete('/:id', authMiddleware, removeDriverSchedule);

export default router;
