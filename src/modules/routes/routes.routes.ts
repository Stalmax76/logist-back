import { Router } from 'express';
import {
	createRoute,
	getRoutes,
	getRouteByID as getRoute,
	getDriverRoutes,
	updateRoute,
	changeStatus,
	deleteRoute,
	getMyRoutes,
} from './routes.controller.ts';

import { createRouteSchema, updateRouteSchema, statusSchema } from './routes.schema.ts';
import { validate } from '../../middleware/validate.ts';
import { authMiddleware } from '../../middleware/auth.ts';
import { allowRoles } from '../../middleware/roles.ts';

const router = Router();

// create route(manager or admin)
router.post(
	'/',
	authMiddleware,
	allowRoles('manager', 'admin'),
	validate(createRouteSchema),
	createRoute
);

// get all routes (manager or admin)
router.get('/', authMiddleware, allowRoles('manager', 'admin'), getRoutes);

// get my routes (driver)
router.get('/my', authMiddleware, allowRoles('driver'), getMyRoutes);

// get routes of any driver(admin or manager)
router.get('/driver/:driver_id', authMiddleware, allowRoles('admin', 'manager'), getDriverRoutes);

// get route by id(driver sees only own routes)
router.get('/:id', authMiddleware, getRoute);

// update route (manager or admin full access, driver limited access)
router.put('/:id', authMiddleware, validate(updateRouteSchema), updateRoute);

// update status
router.patch('/:id/status', authMiddleware, validate(statusSchema), changeStatus);

// delete route (admin only)
router.delete('/:id', authMiddleware, allowRoles('admin'), deleteRoute);

export default router;
