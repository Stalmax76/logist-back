import { db } from '../../config/db.ts';
import type { CreateCarDto, UpdateCarDto } from './car.schema.ts';

export async function findCarById(id: number) {
	const [rows]: any = await db.query('SELECT * FROM cars WHERE id = ?', [id]);
	return rows[0] || null;
}

export async function updateCar(id: number, data: UpdateCarDto) {
	const { plate, model, type, capacity, status } = data;
	const fields = [];
	const values = [];
	for (const [key, value] of Object.entries(data)) {
		if (value === undefined) continue;
		fields.push(`${key} = ?`);
		values.push(value);
	}
	if (fields.length === 0) return;
	values.push(id);

	await db.query(`UPDATE cars SET ${fields.join(', ')} WHERE id = ?`, values);
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
export async function addCar(car: CreateCarDto) {
	const { plate, model, type = 'bus-3500', capacity = 0, status = 'available' } = car;

	const [result]: any = await db.query(
		'INSERT INTO cars(model,plate, capacity, type, status) VALUES(?, ?, ?, ?, ?)',
		[model, plate, capacity, type, status]
	);
	return result.insertId;
}
