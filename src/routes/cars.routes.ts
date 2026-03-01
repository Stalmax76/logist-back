import { Router } from 'express';
import { getCars, createCar } from '../controllers/cars.controller';

const router = Router();

router.get('/', getCars);
router.post('/', createCar);

export default router;
