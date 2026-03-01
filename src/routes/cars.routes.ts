import { Router } from 'express';
import {
	getCars,
	createCar,
	getCarByPlate,
	deleteCarById,
	updateCarById,
} from '../controllers/cars.controller';

const router = Router();

router.get('/', getCars);
router.post('/', createCar);
router.get('/plate/:plate', getCarByPlate);
router.delete('/:id', deleteCarById);
router.put('/:id', updateCarById);

export default router;
