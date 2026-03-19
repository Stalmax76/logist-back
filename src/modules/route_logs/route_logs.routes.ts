import { Router } from 'express';
import { getRouteLog, getRouteLogByIdController } from './route_logs.controller.ts';

import { validate } from '../../middleware/validate.ts';
import { createRouteLogSchema, updateRouteLogSchema } from './route_logs.schema.ts';

const router = Router();

// Створити лог
// router.post('/', validate(createRouteLogSchema), addRouteLog);

// Отримати лог по маршруту
router.get('/route/:route_id', getRouteLog);

// Отримати лог по id
router.get('/log/:id', getRouteLogByIdController);

// Оновити лог (водій або логіст)
// router.put('/:id', validate(updateRouteLogSchema), editRouteLog);

// Оновити статус (логіст/адмін)
// router.patch(
// 	'/:id/status',
// 	validate(updateRouteLogSchema.pick({ status: true })),
// 	changeRouteLogStatus
// );

export default router;
