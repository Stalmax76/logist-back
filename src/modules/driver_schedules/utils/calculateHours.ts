export function calculateHours(
	start: string | null | undefined,
	end: string | null | undefined,
	breakMinutes: number = 0
) {
	if (!start || !end) {
		return { actual: 0, overtime: 0 };
	}

	const startDate = new Date(start);
	const endDate = new Date(end);

	const diffMs = endDate.getTime() - startDate.getTime();
	const diffHours = diffMs / (1000 * 60 * 60);

	const actual = Math.max(diffHours - breakMinutes / 60, 0);

	return { actual, overtime: 0 }; // overtime додамо в сервісі
}
