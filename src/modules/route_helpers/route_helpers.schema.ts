import { z } from 'zod';

export const createRouteHelperSchema = z.object({
	routeId: z.number().int().nonnegative(),
	helperId: z.number().int().nonnegative(),
});

export type CreateRouteHelperDto = z.infer<typeof createRouteHelperSchema>;
