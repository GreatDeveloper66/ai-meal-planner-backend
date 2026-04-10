import dotenv from 'dotenv';
dotenv.config();
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import OpenAI from 'openai';
import { Request, Response } from 'express';
import { ApiResponse, TestGPTRequest, TestDalleRequest, TestGPTResponse, TestDalleResponse } from '../data_types/index.js'; // Add .js extension
import { DietaryProfile, MealPlan, MealPlanImages } from '../data_types/index.js'; // Add .js extension
import { generateMealPlan } from '../helpers/helpers.ts'; // Add .js extension
// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const testGPT = async (req: TestGPTRequest, res: TestGPTResponse): Promise<void> => {
  const { prompt } = req.body;
  try {
    const response = await generateText({
      model: openai('gpt-4o'),
      prompt: prompt || 'Hello, world! This is a test of the GPT endpoint.',
    });
    res.status(200).json({ text: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ text: 'An error occurred while processing the GPT request.' });
  }
};


export const testDalle = async (req: TestDalleRequest, res: TestDalleResponse): Promise<void> => {
  const { prompt } = req.body;

  try {
    const response = await openaiClient.images.generate({
      model: "dall-e-3",
      prompt: prompt || 'A healthy meal prep with vegetables and grains',
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      res.status(500).json({
        error: 'Failed to generate image: no URL returned'
      });
      return;
    }
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

// Function to generate meal plan based on dietary profile. Input DietaryProfile, output MealPlan

export const getMealPlanFromDietaryProfile = async (req: Request<{}, {}, DietaryProfile>, res: Response<ApiResponse>): Promise<void> => {
  const profile = req.body;
  try {
    const mealPlan = await generateMealPlan(profile);
    res.status(200).json({ success: true, data: mealPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getMealPlanImages = async (mealPlan: MealPlan): Promise<MealPlanImages> => {
  const mealPlanImages: MealPlanImages = {
    MealPlanImagesUrls: []
  };
  for (const meal of mealPlan.meals) {
    const prompt = `Generate an image for the following meal: ${meal.name}. The meal consists of the following foods: ${meal.foods.map(food => food.name).join(', ')}. Please generate a visually appealing image that represents this meal.`;
    try {
      const response = await openaiClient.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      });
      const imageUrl = response.data?.[0]?.url;
      if (imageUrl) {
        mealPlanImages.MealPlanImagesUrls.push({
          mealImageUrl: imageUrl
        });
      } else {
        console.error(`Failed to generate image for meal ${meal.name}: no URL returned`);
      }
    } catch (error) {
      console.error(`Failed to generate image for meal ${meal.name}:`, error);
    }
  }
  return mealPlanImages;
}
