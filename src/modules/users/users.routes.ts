import { Router } from 'express';
import {
	createUser,
	getUsers,
	getUserById,
	updateUser,
	deactivateUser,
	activateUser,
	loginController,
} from './users.controller.ts';

import { createUserSchema, updateUserSchema } from './users.schema.ts';
import { validate } from '../../middleware/validate.ts';
import { authMiddleware } from '../../middleware/auth.ts';
import { allowRoles } from '../../middleware/roles.ts';

const router = Router();

router.post('/login', loginController);

// GET all users
router.get('/', authMiddleware, allowRoles('admin', 'manager'), getUsers);

// GET one user
router.get('/:id', authMiddleware, getUserById);

// CREATE user
router.post('/', authMiddleware, allowRoles('admin'), validate(createUserSchema), createUser);

// UPDATE user (partial)
router.put('/:id', authMiddleware, validate(updateUserSchema), updateUser);

// DEACTIVATE user (soft delete)
router.patch('/:id/deactivate', authMiddleware, allowRoles('admin'), deactivateUser);

// ACTIVATE user (restore)
router.patch('/:id/activate', authMiddleware, allowRoles('admin'), activateUser);

export default router;
