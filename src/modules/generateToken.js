import jwt from 'jsonwebtoken';

const token = jwt.sign(
	{
		id: 1,
		role: 'admin',
		email: 'admin@example.com',
	},
	'supersecretkey',
	{ expiresIn: '7d' }
);

console.log('TOKEN:', token);
