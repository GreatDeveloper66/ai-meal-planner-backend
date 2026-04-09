// server.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { testGPT, testDalle } from './controllers/Controllers.js';



const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Meal Planner API is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Test endpoint for GPT
app.post('/api/test-gpt', testGPT);




// Test endpoint for DALL-E
app.post('/api/test-dalle', testDalle);


