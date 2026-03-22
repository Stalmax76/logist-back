import type { Request, Response } from 'express';
import { helpersService } from './helpers.service.ts';
import type { CreateHelperDto, UpdateHelperDto } from './helpers.schema.ts';

export class HelpersController {
	async getAll(req: Request, res: Response) {
		try {
			const helpers = await helpersService.getAll();
			res.json(helpers);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}

	async getById(req: Request<{ id: string }>, res: Response) {
		try {
			const id = Number(req.params.id);

			if (isNaN(id)) {
				return res.status(400).json({ message: 'Invalid ID' });
			}

			const helper = await helpersService.getById(id);

			if (!helper) {
				return res.status(404).json({ message: 'Helper not found' });
			}

			res.json(helper);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}

	async search(req: Request<{}, {}, {}, { name: string }>, res: Response) {
		try {
			const name = (req.query.name || '').trim();

			if (!name) {
				return res.status(400).json({ message: 'Name query is required' });
			}

			const helpers = await helpersService.findByName(name);
			res.json(helpers);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}

	async create(req: Request<{}, {}, CreateHelperDto>, res: Response) {
		try {
			const helper = await helpersService.create(req.body);
			res.status(201).json(helper);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}

	async update(req: Request<{ id: string }, {}, UpdateHelperDto>, res: Response) {
		try {
			const id = Number(req.params.id);

			if (isNaN(id)) {
				return res.status(400).json({ message: 'Invalid ID' });
			}

			const updated = await helpersService.update(id, req.body);

			if (!updated) {
				return res.status(404).json({ message: 'Helper not found' });
			}

			res.json(updated);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}

	async delete(req: Request<{ id: string }>, res: Response) {
		try {
			const id = Number(req.params.id);

			if (isNaN(id)) {
				return res.status(400).json({ message: 'Invalid ID' });
			}

			await helpersService.delete(id);
			res.json({ message: 'Deleted' });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}
}

export const helpersController = new HelpersController();
