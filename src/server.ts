// src/server.ts

import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { testGPT, testDalle, getMealPlanFromDietaryProfile, getMealPlanImages } from './controllers/Controllers.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Meal Planner API is running');
});

// Test endpoint for GPT
app.post('/api/test-gpt', testGPT);

// Test endpoint for DALL-E
app.post('/api/test-dalle', testDalle);

// end point for getting meal plan from dietary profile
app.post('/api/meal-plan', getMealPlanFromDietaryProfile);

//end point for getting meal plan images
app.post('/api/meal-plan-images', getMealPlanImages);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});