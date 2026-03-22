import type { Request, Response } from 'express';
import { routeHelpersService } from './route_helpers.service.ts';
import { createRouteHelperSchema } from './route_helpers.schema.ts';

class RouteHelpersController {
	async add(req: Request, res: Response) {
		try {
			const parsed = createRouteHelperSchema.safeParse(req.body);

			if (!parsed.success) {
				return res.status(400).json({ message: 'Invalid data' });
			}

			const result = await routeHelpersService.add(parsed.data);
			res.status(201).json(result);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}

	async remove(req: Request, res: Response) {
		try {
			const routeId = Number(req.query.routeId);
			const helperId = Number(req.query.helperId);

			if (isNaN(routeId) || isNaN(helperId)) {
				return res.status(400).json({ message: 'routeId and helperId are required' });
			}

			await routeHelpersService.remove(routeId, helperId);
			res.json({ message: 'Deleted' });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}

	async getHelpersByRoute(req: Request<{ id: string }>, res: Response) {
		try {
			const routeId = Number(req.params.id);

			if (isNaN(routeId)) {
				return res.status(400).json({ message: 'Invalid route ID' });
			}

			const helpers = await routeHelpersService.getHelpersByRoute(routeId);
			res.json(helpers);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}

	async getRoutesByHelper(req: Request<{ id: string }>, res: Response) {
		try {
			const helperId = Number(req.params.id);

			if (isNaN(helperId)) {
				return res.status(400).json({ message: 'Invalid helper ID' });
			}

			const routes = await routeHelpersService.getRoutesByHelper(helperId);
			res.json(routes);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
	}
}

export const routeHelpersController = new RouteHelpersController();
