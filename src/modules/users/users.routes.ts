import { Router } from 'express';
import {
	createUser,
	getUsers,
	getUserById,
	updateUser,
	deactivateUser,
	activateUser,
} from './users.controller.ts';

import { createUserSchema, updateUserSchema } from './users.schema.ts';
import { validate } from '../../middleware/validate.ts';

const router = Router();

// GET all users
router.get('/', getUsers);

// GET one user
router.get('/:id', getUserById);

// CREATE user
router.post('/', validate(createUserSchema), createUser);

// UPDATE user (partial)
router.put('/:id', validate(updateUserSchema), updateUser);

// DEACTIVATE user (soft delete)
router.patch('/:id/deactivate', deactivateUser);

// ACTIVATE user (restore)
router.patch('/:id/activate', activateUser);

export default router;
