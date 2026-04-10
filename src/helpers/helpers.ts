import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { DietaryProfile, MealPlan } from '../data_types';


export const generateMealPlan = async (profile: DietaryProfile): Promise<MealPlan> => {
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