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
} from './reports.types.ts';

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
}

export default new ReportsService();
