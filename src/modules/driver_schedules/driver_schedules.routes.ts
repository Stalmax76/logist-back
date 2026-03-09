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

const router = Router();

router.post('/', validate(createDriverScheduleSchema), createSchedule);
router.get('/driver/:driver_id', getDriverSchedules);
router.get('/:id', getDriverSchedule);
router.patch('/:id', validate(updateDriverScheduleSchema), updateDriverScheduleHelper);
router.delete('/:id', removeDriverSchedule);

export default router;
