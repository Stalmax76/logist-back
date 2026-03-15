import mysql from 'mysql2/promise';
export const db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'logist_db',
	port: 3306,
	dateStrings: true,
});
