// -----------------------------
// 1. Type of report
// -----------------------------
import type { ReportPeriod } from '../../utills/date/period.ts';

// -----------------------------
// 2. Type of report target
// -----------------------------
export type ReportTargetType = 'driver' | 'car' | 'route' | 'route_number' | 'company';

// -----------------------------
// 3. Notes for report
// -----------------------------
export interface DriverRouteEntry {
	routeId: number;
	date: string;
	routeNumber: string;
	carId: number;
	carPlateNumber?: string;
	startLocation: string;
	endLocation: string;
	actualHours: number;
	actualKm: number;
	plannedHours: number;
	plannedKm: number;
	overtimeHours: number;
	helperName?: string;
	status: string;
}

// -----------------------------
// 4. Data for driver summary
// -----------------------------
export interface DriverSummary {
	driverId: number;
	firstName: string;
	lastName: string;
	totalHours: number;
	totalKm: number;
	routesCount: number;
}

// -----------------------------
// 5. Statistics for helpers
// -----------------------------
export interface HelperStats {
	helperName: string;
	routesCount: number;
	totalHours: number;
	totalKm: number;
}

// -----------------------------
// 6. Overtime stats
// -----------------------------
export interface OvertimeStats {
	totalOvertimeHours: number;
	totalOvertimeKm: number;
	overtimeRoutesCount: number;
}

// -----------------------------
// 7. Efficiency
// -----------------------------
export interface DriverEfficiency {
	efficiencyScore: number; // 0–100
	onTimePercentage: number;
	overtimePercentage: number;
	avgHoursPerRoute: number;
	avgKmPerRoute: number;
}

// -----------------------------
// 8. Report for route number
// -----------------------------
export interface RouteNumberSummary {
	routeNumber: string;
	totalRoutes: number;
	totalHours: number;
	totalKm: number;
	avgHours: number;
	avgKm: number;
	driversInvolved: number;
}

export interface RouteNumberEntry {
	routeId: number;
	date: string;
	driverId: number;
	driverName: string;
	actualHours: number;
	actualKm: number;
	plannedHours: number;
	plannedKm: number;
	overtimeHours: number;
	status: string;
}

export interface RouteNumberReport {
	target: 'route_number';
	period: ReportPeriod;
	summary: RouteNumberSummary;
	routes: RouteNumberEntry[];
}

// -----------------------------
// 9. Universal report by driver
// -----------------------------
export interface DriverReport {
	target: ReportTargetType;
	period: ReportPeriod;
	summary: DriverSummary;
	routes: DriverRouteEntry[];
	helpers: HelperStats[];
	overtime: OvertimeStats;
	efficiency: DriverEfficiency;
}
