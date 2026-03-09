import { Router } from 'express';
import {
	createRoute,
	getRoutes,
	getRoute,
	getDriverRoutes,
	updateRoute,
	changeStatus,
	deleteRoute,
} from './routes.controller.ts';

import { createRouteSchema, updateRouteSchema } from './routes.schema.ts';
import { validate } from '../../middleware/validate.ts';

const router = Router();

router.post('/', validate(createRouteSchema), createRoute);
router.get('/', getRoutes);
router.get('/driver/:driver_id', getDriverRoutes);
router.get('/:id', getRoute);
router.put('/:id', validate(updateRouteSchema), updateRoute);
router.patch('/:id/status', validate(updateRouteSchema.pick({ status: true })), changeStatus);
router.delete('/:id', deleteRoute);
export default router;
