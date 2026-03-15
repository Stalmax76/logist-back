import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
	try {
		const header = req.headers.authorization;

		if (!header || !header.startsWith('Bearer ')) {
			return res.status(401).json({ error: 'Unauthorization token missing' });
		}

		const token = header.split(' ')[1];
		const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
		req.user = {
			id: decoded.id,
			role: decoded.role,
			email: decoded.email,
		};
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
}
