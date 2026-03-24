import type { ReportPeriod } from '../../utills/date/period.ts';

// Car Report Types
export interface CarReport {
	target: 'car';
	period: ReportPeriod;
	carInfo: CarInfo;
	summary: CarSummary;
	routes: CarRouteEntry[];
	drivers: CarDriverStats[];
	efficiency: CarEfficiency;
}

// Car Info (header)
export interface CarInfo {
	carId: number;
	plate: string;
	model: string;
	type: 'bus' | 'van' | 'truck';
	capacity: number;
	status: 'available' | 'on_route' | 'repair';
}

// Route Entry
export interface CarRouteEntry {
	routeId: number;
	date: string;
	routeNumber: string;
	driver: {
		id: number;
		firstName: string;
		lastName: string;
	};
	startLocation: string;
	endLocation: string;
	plannedKm: number;
	actualKm: number;
	plannedHours: number;
	actualHours: number;
	overtimeHours: number;
	status: string;
}

// Summary
export interface CarSummary {
	totalKm: number;
	totalHours: number;
	routesCount: number;
	daysWorked: number;
	daysIdle: number;
}

// Driver Stats
export interface CarDriverStats {
	driverId: number;
	firstName: string;
	lastName: string;
	routesCount: number;
	totalKm: number;
	totalHours: number;
}

// Efficiency
export interface CarEfficiency {
	usagePercentage: number; // % днів, коли авто працювало
	idlePercentage: number; // % днів простою
	avgKmPerRoute: number;
	avgHoursPerRoute: number;
	reliabilityScore: number; // 0–100 (чим частіше ремонт — тим нижче)
}
