export function startOfDay(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

export function endOfDay(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
}

export function startOfWeek(date: Date) {
	const d = new Date(date);
	const day = d.getDay() === 0 ? 7 : d.getDay();
	d.setDate(d.getDate() - (day - 1));
	return startOfDay(d);
}

export function endOfWeek(date: Date) {
	const d = startOfWeek(date);
	d.setDate(d.getDate() + 6);
	return endOfDay(d);
}

export function startOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
}

export function endOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
}

export function startOfQuarter(date: Date) {
	const quarter = Math.floor(date.getMonth() / 3);
	return new Date(date.getFullYear(), quarter * 3, 1, 0, 0, 0);
}

export function endOfQuarter(date: Date) {
	const quarter = Math.floor(date.getMonth() / 3);
	return new Date(date.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59);
}

export function startOfYear(date: Date) {
	return new Date(date.getFullYear(), 0, 1, 0, 0, 0);
}

export function endOfYear(date: Date) {
	return new Date(date.getFullYear(), 11, 31, 23, 59, 59);
}
