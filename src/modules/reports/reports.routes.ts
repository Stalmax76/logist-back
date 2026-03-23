import { Router } from 'express';
import reportsController from './reports.controller.ts';

const router = Router();

router.get('/driver', reportsController.getDriverReport);

export default router;
