import { Request, Response } from 'express';
import { getAllCars, addCar } from '../services/cars.services';

export async function getCars(req: Request, res: Response) {
	try {
		const cars = await getAllCars();
		res.json(cars);
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
}

export async function createCar(req: Request, res: Response) {
	try {
		const { plate, model, type, capacity, status } = req.body;

		if (!model || !plate) {
			return res.status(400).json({ error: 'Model and plate are required' });
		}

		const newCarId = await addCar({ plate, model, type, capacity, status });
		res.status(201).json({
			message: `Car with plate ${plate} created successfully`,
			id: newCarId,
		});
	} catch (error: any) {
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(400).json({ error: 'Car with this plate already exists' });
		}

		res.status(500).json({ error: 'Internal server error' });
	}
}
