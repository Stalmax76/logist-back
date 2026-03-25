import type { CarInfo } from './car_report.types.ts';

export interface RouteReport {
	target: 'route';
	routeInfo: RouteInfo;
	driver: DriverInfo;
	car: CarInfo;
	helpers: RouteHelper[];
	stats: RouteStats;
	efficiency: RouteEfficiency;
}
export interface RouteInfo {
	routeId: number;
	date: string;
	routeNumber: string;
	startLocation: string;
	endLocation: string;
	status: string;
}
export interface DriverInfo {
	id: number;
	firstName: string;
	lastName: string;
}
export interface RouteStats {
	plannedKm: number;
	actualKm: number;
	plannedHours: number;
	actualHours: number;
	overtimeHours: number;
}
export interface RouteEfficiency {
	onTime: boolean;
	kmAccuracy: number; // %
	hoursAccuracy: number; // %
	efficiencyScore: number; // 0–100
}
export interface RouteRaw {
	routeId: number;
	date: string;
	routeNumber: string;
	startLocation: string;
	endLocation: string;
	status: string;
	planned_km: number;
	actual_km: number;
	planned_hours: number;
	actual_hours: number;
}
export interface RouteHelper {
	helperName: string;
}
