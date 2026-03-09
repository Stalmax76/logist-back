export interface User {
	id: number;
	employee__number: string;
	first_name: string;
	last_name: string;
	phone?: string;
	email: string;
	password_hash: string;
	is_active: boolean;
	role: 'admin' | 'driver' | 'manager';
	created_at: string;
	updated_at: string;
}
