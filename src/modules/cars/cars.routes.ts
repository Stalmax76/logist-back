import { Router } from 'express';
import {
	getCars,
	createCar,
	getCarByPlate,
	deleteCarById,
	updateCarById,
} from './cars.controller.ts';
import { createCarSchema, updateCarSchema } from './car.schema.ts';
import { validate } from '../../middleware/validate.ts';
const router = Router();

router.get('/', getCars);
router.get('/plate/:plate', getCarByPlate);
router.post('/', validate(createCarSchema), createCar);
router.put('/:id', validate(updateCarSchema), updateCarById);
router.delete('/:id', deleteCarById);

export default router;
