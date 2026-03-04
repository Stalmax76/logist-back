import { Router } from 'express';
import { getCars, createCar, getCarByPlate, deleteCarById, updateCarById } from './cars.controller';

const router = Router();

router.get('/', getCars);
router.get('/plate/:plate', getCarByPlate);
router.post('/', createCar);
router.put('/:id', updateCarById);
router.delete('/:id', deleteCarById);

export default router;
