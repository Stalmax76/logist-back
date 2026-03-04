import { db } from '../../config/db';
import { NewCar } from './cars.types';

export async function findCarById(id: number) {
	const [rows]: any = await db.query('SELECT * FROM cars WHERE id = ?', [id]);
	return rows[0] || null;
}

export async function updateCar(id: number, data: NewCar) {
	const { plate, model, type, capacity, status } = data;

	await db.query(
		'UPDATE cars SET plate = ?, model = ?, type = ?, capacity = ?, status = ? WHERE id = ?',
		[plate, model, type, capacity, status, id]
	);
}

export async function removeCarById(id: number) {
	const [result]: any = await db.query('DELETE FROM cars WHERE id = ?', [id]);
	return result.affectedRows;
}

export async function findCarByPlate(plate: string) {
	const [rows]: any = await db.query('SELECT * FROM cars WHERE plate = ?', [plate]);
	return rows[0] || null;
}

export async function getAllCars() {
	try {
		const [rows] = await db.query('SELECT * FROM cars');
		return rows;
	} catch (error) {
		console.error('DB error:', error);
		throw error;
	}
}
export async function addCar(car: NewCar) {
	const { plate, model, type = 'bus-3500', capacity = 0, status = 'avilable' } = car;

	const [result]: any = await db.query(
		'INSERT INTO cars(model,plate, capacity, type, status) VALUES(?, ?, ?, ?, ?)',
		[model, plate, capacity, type, status]
	);
	return result.insertId;
}
