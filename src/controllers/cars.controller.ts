import { Request, Response } from 'express';
import {
	getAllCars,
	addCar,
	findCarByPlate,
	removeCarById,
	updateCar,
	findCarById,
} from '../services/cars.services';

export async function updateCarById(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const { plate, model, type, capacity, status } = req.body;

		// check if car exists
		const existingCar = await findCarById(id);
		if (!existingCar) {
			return res.status(404).json({ error: 'Car not found' });
		}

		await updateCar(id, { plate, model, type, capacity, status });
		const cars = await getAllCars();

		res.json({ message: 'Car updated successfully', id, cars });
	} catch (error) {
		console.error('error in updateCarById:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ========== delete car by id ===========
export async function deleteCarById(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const deleted = await removeCarById(Number(id));

		if (deleted === 0) {
			return res.status(404).json({ error: 'Car not found' });
		}
		// після видалення отримуєм оновлений список
		const cars = await getAllCars();

		res.json({ message: 'Car deleted successfully', id, cars });
	} catch (error) {
		console.error('Delete error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ========== get car by plate ===========
export async function getCarByPlate(reg: Request, res: Response) {
	try {
		const { plate } = reg.params as { plate: string }; //plate is a string;

		const car = await findCarByPlate(plate);

		if (!car) {
			return res.status(404).json({ error: 'Car not found' });
		}
		res.json(car);
	} catch (error) {
		console.error('error in getCarByPlate:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ======== get cars ========
export async function getCars(req: Request, res: Response) {
	try {
		const cars = await getAllCars();
		res.json(cars);
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ======== create car ========
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
