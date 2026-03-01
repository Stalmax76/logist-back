import { Router } from 'express';
import { getCars } from '../controllers/cars.controller';

const router = Router();

router.get('/', getCars);

export default router;
