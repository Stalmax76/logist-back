import { Router } from 'express';
import { routeHelpersController } from './route_helpers.controller.ts';

const router = Router();

// POST /route-helpers  → added helper for route
router.post('/', (req, res) => routeHelpersController.add(req, res));

// DELETE /route-helpers?routeId=1&helperId=2  → delete helper from route
router.delete('/', (req, res) => routeHelpersController.remove(req, res));

// GET /route-helpers/route/:id  → get all helpers for route
router.get('/route/:id', (req, res) => routeHelpersController.getHelpersByRoute(req, res));

// GET /route-helpers/helper/:id  → get all routes for helper
router.get('/helper/:id', (req, res) => routeHelpersController.getRoutesByHelper(req, res));

export default router;
