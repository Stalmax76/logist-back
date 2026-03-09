import { Router } from 'express';
import {
	createUser,
	getUsers,
	getUserById,
	updateUser,
	deactivateUser,
} from './users.controller.ts';
import { createUserSchema, updateUserSchema } from './users.schema.ts';
import { validate } from '../../middleware/validate.ts';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(updateUserSchema), updateUser);
router.patch('/:id/deactivate', deactivateUser);

export default router;
