import dotenv from 'dotenv';
dotenv.config();
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import OpenAI from 'openai';
import { Request, Response } from 'express';
import { ApiResponse, TestGPTRequest, TestDalleRequest, TestGPTResponse, TestDalleResponse } from '../data_types/index.js';
import { DietaryProfile, MealPlan, MealPlanImages, Meal, FoodItem } from '../data_types/index.js';
import { generateMealPlan } from '../helpers/helpers.js'; // Add .js extension
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

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
};

const isValidDietaryProfile = (body: unknown): body is DietaryProfile => {
  if (typeof body !== 'object' || body === null) return false;
  const candidate = body as Record<string, unknown>;
  const allowedSex = ['male', 'female', 'other'];
  const allowedActivity = ['sedentary', 'light', 'moderate', 'active', 'very active'];
  const allowedBudget = ['low', 'normal', 'high'];

  return (
    typeof candidate.age === 'number' &&
    allowedSex.includes(candidate.sex as string) &&
    typeof candidate.weight === 'number' &&
    typeof candidate.height === 'number' &&
    allowedActivity.includes(candidate.activityLevel as string) &&
    isStringArray(candidate.dietaryPreferences) &&
    allowedBudget.includes(candidate.budgetLevel as string)
  );
};

export const getMealPlanFromDietaryProfile = async (req: Request<{}, {}, DietaryProfile>, res: Response<ApiResponse<MealPlan>>): Promise<void> => {
  if (!isValidDietaryProfile(req.body)) {
    res.status(400).json({
      success: false,
      error: 'Invalid request body. Expected a valid DietaryProfile object.'
    });
    return;
  }

  const profile = req.body;

  try {
    const mealPlan = await generateMealPlan(profile);

    if (!mealPlan || !Array.isArray(mealPlan.meals) || mealPlan.meals.length === 0) {
      res.status(404).json({
        success: false,
        error: 'No meal plan could be generated from the AI response.'
      });
      return;
    }

    res.status(200).json({ success: true, data: mealPlan });
  } catch (error) {
    console.error('Meal plan generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown server error while generating meal plan.'
    });
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isFoodItem = (value: unknown): value is FoodItem => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.calories === 'number' &&
    typeof value.protein === 'number' &&
    typeof value.carbs === 'number' &&
    typeof value.fat === 'number' &&
    (typeof value.quantity === 'undefined' || typeof value.quantity === 'string')
  );
};

const isMeal = (value: unknown): value is Meal => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    (value.name === 'breakfast' || value.name === 'lunch' || value.name === 'dinner') &&
    Array.isArray(value.foods) &&
    value.foods.every(isFoodItem)
  );
};

const isMealPlan = (value: unknown): value is MealPlan => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.date === 'string' &&
    Array.isArray(value.meals) &&
    value.meals.every(isMeal)
  );
};

export const getMealPlanImages = async (req: Request<{}, {}, MealPlan>, res: Response<ApiResponse<MealPlanImages>>): Promise<void> => {
  const mealPlan = req.body;

  if (!isMealPlan(mealPlan)) {
    res.status(400).json({
      success: false,
      error: 'Invalid request body. Expected a MealPlan object with a valid meals array and proper food items.'
    });
    return;
  }

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

  res.status(200).json({ success: true, data: mealPlanImages });
}
