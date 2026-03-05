import express from 'express';
import carsRouter from './modules/cars/cars.routes';
import usersRouter from './modules/users/users.routes';
import routesRouter from './modules/routes/routes.routes';
import routeLogRouter from './modules/route_logs/route_logs.routes';

const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/routes', routesRouter);
app.use('/cars', carsRouter);
app.use('/users', usersRouter);
app.use('/route_logs', routeLogRouter);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
