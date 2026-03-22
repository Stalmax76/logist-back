import { Router } from 'express';
import { helpersController } from './helpers.controller.ts';

const router = Router();

// GET /helpers
router.get('/', (req, res) => helpersController.getAll(req, res));

// GET /helpers/search?name=...
router.get('/search', (req, res) => helpersController.search(req, res));

// GET /helpers/:id
router.get('/:id', (req, res) => helpersController.getById(req, res));

// POST /helpers
router.post('/', (req, res) => helpersController.create(req, res));

// PUT /helpers/:id
router.put('/:id', (req, res) => helpersController.update(req, res));

// DELETE /helpers/:id
router.delete('/:id', (req, res) => helpersController.delete(req, res));

export default router;
