import { Router } from 'express';
import {
	createRoute,
	getRoutes,
	getRoute,
	getDriverRoutes,
	updateRoute,
	changeStatus,
} from './routes.controller';

const router = Router();

router.post('/', createRoute);
router.get('/', getRoutes);
router.get('/driver/:driver_id', getDriverRoutes);
router.get('/:id', getRoute);
router.put('/:id', updateRoute);
router.patch('/:id/status', changeStatus);

export default router;
