// server.js
import 'dotenv/config';
import express from 'express';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


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
app.post('/api/test-gpt', async (req, res) => {
  const { prompt } = req.body;

  try {
    const { text } = await generateText({
      model: openai('gpt-4o'), // or 'gpt-3.5-turbo'
      prompt: prompt || 'Suggest a healthy breakfast idea.',
    });

    res.status(200).json({ success: true, data: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});