import { Request, Response } from 'express';
import { getAllCars } from '../services/cars.services';

export async function getCars(req: Request, res: Response) {
	const cars = await getAllCars();
	res.json(cars);
}
