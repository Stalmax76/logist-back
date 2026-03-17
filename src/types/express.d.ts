import type { User } from './users/user.types.ts';

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
