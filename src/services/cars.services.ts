import { db } from '../config/db';

export async function getAllCars() {
	const [rows] = await db.query('SELECT * FROM cars');
	return rows;
}
