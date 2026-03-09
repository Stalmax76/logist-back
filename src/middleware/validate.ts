import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validate =
	(schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
		try {
			req.body = schema.parse(req.body);
			next();
		} catch (error: any) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({ error: error.issues });
			}
			next(error);
		}
	};
