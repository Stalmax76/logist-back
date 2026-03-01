import express from 'express';
import carsRoutes from './routes/cars.routes';

const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/cars', carsRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
