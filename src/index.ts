import express from 'express';
import carsRouter from './modules/cars/cars.routes.ts';
import usersRouter from './modules/users/users.routes.ts';
import routesRouter from './modules/routes/routes.routes.ts';
import routeLogRouter from './modules/route_logs/route_logs.routes.ts';
import driverSchedulesRouter from './modules/driver_schedules/driver_schedules.routes.ts';
import authRouter from './modules/auth/auth.routs.ts';
import driverDaysOffRoutes from './modules/driver_days_off/driver_days_off.routes.ts';

const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/auth', authRouter);
app.use('/routes', routesRouter);
app.use('/cars', carsRouter);
app.use('/users', usersRouter);
app.use('/route_logs', routeLogRouter);
app.use('/driver_schedules', driverSchedulesRouter);
app.use('/driver_days_off', driverDaysOffRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
