import { Router } from 'express';
import {
	addRouteLog,
	getRouteLog,
	editRouteLog,
	changeRouteLogStatus,
} from './route_logs.controller';

const router = Router();

// Створити лог
router.post('/', addRouteLog);

// Отримати лог по маршруту
router.get('/:route_id', getRouteLog);

// Оновити лог (водій або логіст)
router.patch('/:id', editRouteLog);

// Оновити статус (логіст/адмін)
router.patch('/:id/status', changeRouteLogStatus);

export default router;
