import { db } from '../../config/db.ts';

import { resolvePeriod } from './filters/period.filter.ts';
import type { ReportPeriod } from '../../utills/date/period.ts';
import type {
	DriverReport,
	DriverRouteEntry,
	DriverSummary,
	HelperStats,
	OvertimeStats,
	DriverEfficiency,
} from './driver_reports.types.ts';
import type {
	CarReport,
	CarInfo,
	CarSummary,
	CarRouteEntry,
	CarDriverStats,
	CarEfficiency,
} from './car_report.types.ts';

class ReportsService {
	async getDriverReport(driverId: number, period: ReportPeriod): Promise<DriverReport> {
		//  Calculating the actual period range
		const { from, to } = resolvePeriod(period);
		//  Get driver routes
		const routes = await this.getDriverRoutes(driverId, from, to);
		//  We form a summry
		const summary = this.buildDriverSummary(driverId, routes);
		// We generate statistics on assistants
		const helpers = this.buildHelpersStats(routes);
		// We generate statistics on overtime
		const overtime = this.buildOvertimeStats(routes);
		// We generate statistics on efficiency
		const efficiency = this.buildDriverEfficiency(routes);
		// We return the report
		return {
			target: 'driver',
			period: { from, to, type: period.type },
			summary,
			routes,
			helpers,
			overtime,
			efficiency,
		};
	}

	// get driver routes
	private async getDriverRoutes(
		driverId: number,
		from: Date,
		to: Date
	): Promise<DriverRouteEntry[]> {
		const sql = `
        SELECT 
            r.id AS routeId,
            r.date,
            r.route_number AS routeNumber,
            r.car_id AS carId,
            c.plate AS carPlateNumber,
            r.start_location AS startLocation,
            r.end_location AS endLocation,
            r.actual_hours AS actualHours,
            r.actual_km AS actualKm,
            r.planned_hours AS plannedHours,
            r.planned_km AS plannedKm,
            GREATEST(r.actual_hours - r.planned_hours, 0) AS overtimeHours,
            r.helper_name AS helperName,
            r.status
        FROM routes r
        LEFT JOIN cars c ON c.id = r.car_id
        WHERE r.driver_id = ?
          AND r.date BETWEEN ? AND ?
        ORDER BY r.date ASC;
    `;

		const [rows] = await db.execute(sql, [driverId, from, to]);

		return rows as DriverRouteEntry[];
	}

	// build driver summary
	private buildDriverSummary(driverId: number, routes: DriverRouteEntry[]): DriverSummary {
		let totalHours = 0;
		let totalKm = 0;

		for (const r of routes) {
			totalHours += r.actualHours;
			totalKm += r.actualKm;
		}

		return {
			driverId,
			driverName: 'John Doe', // change from db
			totalHours,
			totalKm,
			routesCount: routes.length,
		};
	}

	// build helpers stats
	private buildHelpersStats(routes: DriverRouteEntry[]): HelperStats[] {
		const map = new Map<string, HelperStats>();

		for (const r of routes) {
			if (!r.helperName) continue;

			const helpers = r.helperName
				.split(/[,;|]/)
				.map((h) => h.trim())
				.filter((h) => h.length > 0);

			for (const helper of helpers) {
				if (!map.has(helper)) {
					map.set(helper, {
						helperName: helper,
						routesCount: 0,
						totalHours: 0,
						totalKm: 0,
					});
				}
			}

			const h = map.get(r.helperName)!;
			h.routesCount++;
			h.totalHours += r.actualHours;
			h.totalKm += r.actualKm;
		}
		return Array.from(map.values());
	}

	// build overtime stats
	private buildOvertimeStats(routes: DriverRouteEntry[]): OvertimeStats {
		let totalOvertimeHours = 0;
		let totalOvertimeKm = 0;
		let overtimeRoutesCount = 0;
		for (const r of routes) {
			const overtimeHours = Math.max(0, r.actualHours - r.plannedHours);
			const overtimeKm = Math.max(0, r.actualKm - r.plannedKm);
			if (overtimeHours > 0) {
				totalOvertimeHours += overtimeHours;
				overtimeRoutesCount++;
			}
			if (overtimeKm > 0) {
				totalOvertimeHours += overtimeKm;
				overtimeRoutesCount++;
			}
		}
		return {
			totalOvertimeHours,
			totalOvertimeKm,
			overtimeRoutesCount,
		};
	}

	// build driver efficiency
	private buildDriverEfficiency(routes: DriverRouteEntry[]): DriverEfficiency {
		if (routes.length === 0) {
			return {
				efficiencyScore: 0, // 0–100
				onTimePercentage: 0,
				overtimePercentage: 0,
				avgHoursPerRoute: 0,
				avgKmPerRoute: 0,
			};
		}
		let totalHours = 0;
		let totalKm = 0;

		let onTimeRoutes = 0;
		let overtimeRoutes = 0;
		let totalHourDiff = 0;
		let totalKmDiff = 0;

		for (const route of routes) {
			totalHours += route.actualHours;
			totalKm += route.actualKm;

			if (route.actualHours <= route.plannedHours) {
				onTimeRoutes++;
			}

			if (route.actualHours > route.plannedKm) {
				overtimeRoutes++;
			}

			totalHourDiff += Math.abs(route.actualHours - route.plannedHours);
			totalKmDiff += Math.abs(route.actualKm - route.plannedKm);
		}
		const avgHoursPerRoute = totalHours / routes.length;
		const avgKmPerRoute = totalKm / routes.length;

		const onTimePercentage = (onTimeRoutes / routes.length) * 100;
		const overtimePercentage = (overtimeRoutes / routes.length) * 100;

		let score = 0;
		//  40% onTimePercentage
		score += onTimePercentage * 0.4;
		//  30% has no overtime
		score += (100 - overtimePercentage) * 0.3;

		// 20% hours accuracy
		const hoursAccuracy = Math.max(0, 100 - totalHourDiff * 5);
		score += hoursAccuracy * 0.2;

		// 10% km accuracy
		const kmAccuracy = Math.max(0, 100 - totalKmDiff * 2);
		score += kmAccuracy * 0.1;
		return {
			efficiencyScore: Math.round(score),
			onTimePercentage,
			overtimePercentage,
			avgHoursPerRoute,
			avgKmPerRoute,
		};
	}

	async getCarReport(carId: number, period: ReportPeriod): Promise<CarReport> {
		// 1. get car info
		const carInfo = await this.getCarInfo(carId);
		if (!carInfo) {
			throw new Error(`Car with id ${carId} not found`);
		}

		// 2. get routes
		const routes = await this.getCarRoutes(carId, period);

		// 3. summary
		const summary = this.calculateSummary(routes, period);

		// 4. drivers stats
		const drivers = this.calculateDriversStats(routes);

		// 5. efficiency
		const efficiency = this.calculateEfficiency(summary, carInfo);

		// 6. build report
		return {
			target: 'car',
			period,
			carInfo,
			summary,
			routes,
			drivers,
			efficiency,
		};
	}

	// ================================
	// 1. CAR INFO
	//================================
	private async getCarInfo(carId: number): Promise<CarInfo | null> {
		const [rows] = await db.execute<any[]>(
			`SELECT id, plate, model, type, capacity, status
             FROM cars
             WHERE id = ?`,
			[carId]
		);

		if (!Array.isArray(rows) || rows.length === 0) return null;

		const car = rows[0];

		return {
			carId: car.id,
			plate: car.plate,
			model: car.model,
			type: car.type,
			capacity: car.capacity,
			status: car.status,
		};
	}

	// ================================
	// 2. ROUTES
	// ================================
	private async getCarRoutes(carId: number, period: ReportPeriod): Promise<CarRouteEntry[]> {
		const [rows] = await db.execute<any[]>(
			`SELECT 
                r.id AS routeId,
                r.date,
                r.route_number,
                r.start_location,
                r.end_location,
                r.planned_km,
                r.actual_km,
                r.planned_hours,
                r.actual_hours,
               GREATEST(r.actual_hours - r.planned_hours, 0) AS overtime_hours,
                r.status,
                u.id AS driverId,
                u.first_name,
                u.last_name
            FROM routes r
            LEFT JOIN users u ON u.id = r.driver_id
            WHERE r.car_id = ?
              AND r.date BETWEEN ? AND ?
            ORDER BY r.date ASC`,
			[carId, period.from, period.to]
		);

		return rows.map((r: any) => ({
			routeId: r.routeId,
			date: r.date,
			routeNumber: r.route_number,
			driver: {
				id: r.driverId,
				firstName: r.first_name,
				lastName: r.last_name,
			},
			startLocation: r.start_location,
			endLocation: r.end_location,
			plannedKm: r.planned_km,
			actualKm: r.actual_km,
			plannedHours: r.planned_hours,
			actualHours: r.actual_hours,
			overtimeHours: r.overtime_hours,
			status: r.status,
		}));
	}

	// ================================
	// 3. SUMMARY
	// ================================
	private calculateSummary(routes: CarRouteEntry[], period: ReportPeriod): CarSummary {
		const totalKm = routes.reduce((sum, r) => sum + (r.actualKm || 0), 0);
		const totalHours = routes.reduce((sum, r) => sum + (r.actualHours || 0), 0);

		const routesCount = routes.length;

		// days in period
		const from = new Date(period.from);
		const to = new Date(period.to);
		const totalDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

		// days worked
		const workedDates = new Set(routes.map((r) => r.date));
		const daysWorked = workedDates.size;

		const daysIdle = totalDays - daysWorked;

		return {
			totalKm,
			totalHours,
			routesCount,
			daysWorked,
			daysIdle,
		};
	}

	// ================================
	// 4. DRIVERS STATS
	// ================================
	private calculateDriversStats(routes: CarRouteEntry[]): CarDriverStats[] {
		const map = new Map<number, CarDriverStats>();

		for (const r of routes) {
			if (!map.has(r.driver.id)) {
				map.set(r.driver.id, {
					driverId: r.driver.id,
					firstName: r.driver.firstName,
					lastName: r.driver.lastName,
					routesCount: 0,
					totalKm: 0,
					totalHours: 0,
				});
			}

			const d = map.get(r.driver.id)!;
			d.routesCount++;
			d.totalKm += r.actualKm || 0;
			d.totalHours += r.actualHours || 0;
		}

		return Array.from(map.values());
	}

	// ================================
	// 5. EFFICIENCY
	// ================================
	private calculateEfficiency(summary: CarSummary, carInfo: CarInfo): CarEfficiency {
		const totalDays = summary.daysWorked + summary.daysIdle;

		const usagePercentage =
			totalDays > 0 ? Math.round((summary.daysWorked / totalDays) * 100) : 0;
		const idlePercentage = 100 - usagePercentage;

		const avgKmPerRoute = summary.routesCount > 0 ? summary.totalKm / summary.routesCount : 0;
		const avgHoursPerRoute =
			summary.routesCount > 0 ? summary.totalHours / summary.routesCount : 0;

		// reliabilityScore — базова формула
		let reliabilityScore = 100;

		if (carInfo.status === 'repair') {
			reliabilityScore -= 30;
		}

		if (idlePercentage > 70) {
			reliabilityScore -= 20;
		}

		if (summary.totalKm < 100) {
			reliabilityScore -= 10;
		}

		reliabilityScore = Math.max(0, Math.min(100, reliabilityScore));

		return {
			usagePercentage,
			idlePercentage,
			avgKmPerRoute,
			avgHoursPerRoute,
			reliabilityScore,
		};
	}
}

export default new ReportsService();
