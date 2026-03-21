export type DriverDayOffType = 'weekend' | 'sick' | 'vacation' | 'absent' | 'other' | 'worked';

export interface DriverDayOff {
	id: number;
	driverId: number;
	date: string; // ISO date: YYYY-MM-DD
	type: DriverDayOffType;
	notes?: string;
	createdAt: string;
}
