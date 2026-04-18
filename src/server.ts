// src/server.ts
import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { testGPT, testDalle, getMealPlanImages, getMealPlanFromDietaryProfile, getMealPlanWithPriceFromDietaryProfile } from './controllers/Controllers.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Meal Planner API is running');
});

app.post('/api/test-gpt', testGPT);
app.post('/api/test-dalle', testDalle);
app.post('/api/meal-plan', getMealPlanFromDietaryProfile);
app.post('/api/meal-plan-images', getMealPlanImages);
app.post('/api/meal-plan-with-price', getMealPlanWithPriceFromDietaryProfile);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;