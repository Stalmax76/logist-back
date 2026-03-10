import z from 'zod';
import type { Request, Response } from 'express';
import {
	getAllCars,
	addCar,
	findCarByPlate,
	removeCarById,
	updateCar,
	findCarById,
} from './cars.service.ts';

import { createCarSchema, updateCarSchema } from './car.schema.ts';

export async function updateCarById(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'Invalid car ID' });
		}
		// check if car exists
		const existingCar = await findCarById(id);
		if (!existingCar) {
			return res.status(404).json({ error: 'Car not found' });
		}

		const dto = updateCarSchema.parse(req.body);

		await updateCar(id, dto);
		const updatedCar = await findCarById(id);

		res.json({
			message: `Car ID ${updatedCar.id}, plate ${updatedCar.plate} updated successfully`,
		});
	} catch (error: any) {
		if (error.name === 'ZodError') {
			return res.status(400).json({ error: error.errors });
		}
		console.error('error in updateCarById:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ========== delete car by id ===========
export async function deleteCarById(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'Invalid car ID' });
		}

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
		if (!plate) {
			return res.status(400).json({ error: 'Plate is required' });
		}

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
		console.error('Get cars error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ======== create car ========
export async function createCar(req: Request, res: Response) {
	try {
		const dto = createCarSchema.parse(req.body);
		const existing = await findCarByPlate(dto.plate);
		if (existing) {
			return res.status(400).json({ error: 'Car with this plate already exists' });
		}

		const newCarId = await addCar(dto);
		res.status(201).json({
			message: `Car with plate ${dto.plate} created successfully`,
			id: newCarId,
		});
	} catch (error: any) {
		if (error.name === 'ZodError') {
			return res.status(400).json({ error: error.errors });
		}
		console.error('Create error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

export async function getCarById(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'Invalid car ID' });
		}
		const car = await findCarById(id);
		if (!car) {
			return res.status(404).json({ error: 'Car not found' });
		}
		res.json(car);
	} catch (error) {
		console.error('Error getting car by ID:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}
