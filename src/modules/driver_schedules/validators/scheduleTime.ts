export function validateShiftTimes(
	start?: string | null,
	end?: string | null
): { valid: boolean; message?: string } {
	if ((start && !end) || (!start && end)) {
		return {
			valid: false,
			message: 'Both shift_start_time and shift_end_time are required',
		};
	}

	if (!start && !end) {
		return { valid: true };
	}

	// Перевірка формату YYYY-MM-DD HH:mm:ss
	const mysqlDateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

	if (!mysqlDateRegex.test(start!) || !mysqlDateRegex.test(end!)) {
		return {
			valid: false,
			message: 'Invalid date format. Expected "YYYY-MM-DD HH:mm:ss"',
		};
	}

	// Порівняння часу без new Date()
	const startMs = Date.parse(start!.replace(' ', 'T'));
	const endMs = Date.parse(end!.replace(' ', 'T'));

	if (isNaN(startMs) || isNaN(endMs)) {
		return {
			valid: false,
			message: 'Invalid date format for shift times',
		};
	}

	if (endMs < startMs) {
		return {
			valid: false,
			message: 'Shift end time must be after shift start time',
		};
	}

	return { valid: true };
}
