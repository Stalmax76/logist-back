import express from 'express';

const app = express();
const PORT = 5000;
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Logist backend is running');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
