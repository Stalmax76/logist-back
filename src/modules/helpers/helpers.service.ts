import { db } from '../../config/db.ts';
import type { Helper } from './helpers.type.ts';
import type { CreateHelperDto, UpdateHelperDto } from './helpers.schema.ts';

export class HelpersService {
	async getAll(): Promise<Helper[]> {
		const [rows] = await db.query(`
            SELECT 
                id,
                name,
                phone,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM helpers
            ORDER BY id DESC
        `);

		return rows as Helper[];
	}

	async getById(id: number): Promise<Helper | null> {
		const [rows] = await db.query(
			`
            SELECT 
                id,
                name,
                phone,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM helpers
            WHERE id = ?
            `,
			[id]
		);

		const result = rows as Helper[];
		return result.length ? result[0] : null;
	}

	async findByName(name: string): Promise<Helper[]> {
		const [rows] = await db.query(
			`
            SELECT 
                id,
                name,
                phone,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM helpers
            WHERE name LIKE CONCAT('%', ?, '%')
            ORDER BY name ASC
            `,
			[name]
		);

		return rows as Helper[];
	}

	async create(data: CreateHelperDto): Promise<Helper> {
		const { name, phone } = data;

		const [result] = await db.query(
			`
            INSERT INTO helpers (name, phone)
            VALUES (?, ?)
            `,
			[name, phone ?? null]
		);

		const insertId = (result as any).insertId;
		const helper = await this.getById(insertId);

		return helper as Helper;
	}

	async update(id: number, data: UpdateHelperDto): Promise<Helper | null> {
		const fields = [];
		const values = [];

		if (data.name !== undefined) {
			fields.push('name = ?');
			values.push(data.name);
		}

		if (data.phone !== undefined) {
			fields.push('phone = ?');
			values.push(data.phone);
		}

		if (fields.length === 0) return await this.getById(id);

		values.push(id);

		await db.query(
			`
            UPDATE helpers
            SET ${fields.join(', ')}
            WHERE id = ?
            `,
			values
		);

		return await this.getById(id);
	}

	async delete(id: number): Promise<boolean> {
		await db.query(`DELETE FROM helpers WHERE id = ?`, [id]);
		return true;
	}
}

export const helpersService = new HelpersService();
