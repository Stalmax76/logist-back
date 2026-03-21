import { z } from 'zod';

export const driverDaysOffQuerySchema = z
	.object({
		driverId: z.string().regex(/^\d+$/).transform(Number),
		from: z.string().date('Invalid "from" date'),
		to: z.string().date('Invalid "to" date'),
	})
	.refine((data) => new Date(data.from) <= new Date(data.to), {
		message: '"from" must be earlier than "to"',
		path: ['from'],
	});

export type DriverDaysOffQuery = z.infer<typeof driverDaysOffQuerySchema>;
