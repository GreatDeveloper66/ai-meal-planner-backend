// src/controllers/Controllers.ts

// src/controllers/Controllers.ts
import dotenv from 'dotenv';
dotenv.config();
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import OpenAI from 'openai';
import { Request, Response } from 'express';
import { TestGPTRequest, TestDalleRequest, ApiResponse } from '../data_types/index.js'; // Add .js extension
import { DietaryProfile, MealPlan, MealPlanImages } from '../data_types/index.js'; // Add .js extension
// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const testGPT = async (req: Request<{}, {}, TestGPTRequest>, res: Response<ApiResponse>): Promise<void> => {
  const { prompt } = req.body;
  
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: prompt || 'Suggest a healthy breakfast idea.',
    });

    res.status(200).json({ success: true, data: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const testDalle = async (req: Request<{}, {}, TestDalleRequest>, res: Response<ApiResponse>): Promise<void> => {
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
        success: false,
        error: 'Failed to generate image: no URL returned'
      });
      return;
    }
    res.status(200).json({ success: true, data: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

// Function to generate meal plan based on dietary profile. Input DietaryProfile, output MealPlan

export const getMealPlanFromDietaryProfile = async (profile: DietaryProfile): Promise<MealPlan> => {
  const prompt = `Generate a meal plan for a person with the following dietary profile:
  Age: ${profile.age},
  Sex: ${profile.sex},
  Weight: ${profile.weight} kg,
  Height: ${profile.height} cm,
  Activity Level: ${profile.activityLevel},
  Dietary Preferences: ${profile.dietaryPreferences.join(', ')},
  Budget Level: ${profile.budgetLevel}.
  Please provide breakfast, lunch, and dinner suggestions.
  Please include list of foods, calorie estimates, and any relevant nutritional information.
  The meal plan should meet the person's dietary needs and preferences while staying within their calorie and financial budget.
  Please put your answer in the following json format:
  {
    "id": "string",
    "date": "string",
    "meals": [
      {
        "id": "string",
        "name": "breakfast" | "lunch" | "dinner",
        "foods": [
          {
            "id": "string",
            "name": "string",
            "calories": number,
            "protein": number,
            "carbs": number,
            "fat": number,
            "quantity": "string"
          }
        ]
      }
    ]
  }`;
  return await generateText({
    model: openai('gpt-4o'),
    prompt: prompt,
  }).then(response => {
    try {
      const mealPlan: MealPlan = JSON.parse(response.text);
      return mealPlan;
    } catch (error) {
      console.error('Failed to parse meal plan response:', error);
      throw new Error('Failed to parse meal plan response');
    }
  });

}

// Controller function to handle meal plan image generation. Takes in a MealPlan object,  outputs a MealPlanImages object with image URLs for each meal using dall-e-3 model.
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
