import { db } from '../config/db';
import { NewCar } from '../types/interfaces';

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
