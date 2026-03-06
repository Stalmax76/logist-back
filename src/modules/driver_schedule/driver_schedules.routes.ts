import { Router } from 'express';
import {
	createSchedule,
	getDriverSchedule,
	getDriverSchedules,
	removeDriverSchedule,
	updateDriverScheduleHelper,
} from './driver_schedules.controller';

const router = Router();

router.post('/', createSchedule);
router.get('/driver/:driver_id', getDriverSchedules);
router.get('/:id', getDriverSchedule);
router.patch('/id', updateDriverScheduleHelper);
router.delete('/:id', removeDriverSchedule);

export default router;
