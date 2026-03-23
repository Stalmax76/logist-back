export type ReportPeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

export interface ReportPeriod {
	type: ReportPeriodType;
	from: Date;
	to: Date;
}

// getDailyRange(date);

// getWeeklyRange(date);

// getMonthlyRange(date);

// getQuarterlyRange(date);

// getYearlyRange(date);

// normalizeCustomRange(from, to);
