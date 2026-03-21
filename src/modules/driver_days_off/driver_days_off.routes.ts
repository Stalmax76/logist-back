import { Router } from 'express';
import { driverDaysOffController } from './driver_days_off.controller.ts';

const router = Router();

// GET /driver-days-off/:driverId?from=...&to=...
router.get('/:driverId', (req, res) => driverDaysOffController.getDaysOff(req, res));

export default router;
