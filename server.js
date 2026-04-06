// server.js
import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Meal Planner API is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});