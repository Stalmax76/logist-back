import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deactivateUser } from './users.controller';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id/deactivate', deactivateUser);

export default router;
