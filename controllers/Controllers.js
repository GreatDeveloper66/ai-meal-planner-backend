import dotenv from 'dotenv';
dotenv.config();
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import OpenAI from 'openai';

// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export const testGPT = async (req, res) => {
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
}

export const testDalle = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openaiClient.images.generate({
      model: "dall-e-3",
      prompt: prompt || 'A healthy meal prep with vegetables and grains',
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url", // Use "b64_json" for base64 data if you prefer
    });

    const imageUrl = response.data[0].url;
    res.status(200).json({ success: true, data: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}