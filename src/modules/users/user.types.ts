export interface User {
	id: number;
	first_name: string;
	last_name: string;
	phone?: string | null;
	email: string;
	password_hash: string;
	role: 'admin' | 'driver' | 'manager';
	is_active: boolean;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;

	reset_token?: string | null;
	reset_expires?: string | null;
}
