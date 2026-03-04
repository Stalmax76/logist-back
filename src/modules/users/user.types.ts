export interface User {
	id?: number;
	name: string;
	phone?: string;
	email?: string;
	password_hash: string;
	role: 'admin' | 'driver';
	active?: boolean;
}
