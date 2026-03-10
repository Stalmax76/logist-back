interface Car {
	plate: string;
	model: string;
	type: string;
	capacity: number;
	status: 'available' | 'on_route' | 'repair';
}

export type { Car };
