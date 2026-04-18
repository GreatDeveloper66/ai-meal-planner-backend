import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { DietaryProfile, MealPlan, MealPlanWithPrice } from '../data_types';

const extractJsonString = (text: string): string | null => {
  const cleaned = text
    .replace(/```(?:json)?\n?/gi, '')
    .replace(/```/g, '')
    .trim();

  if (!cleaned) {
    return null;
  }

  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    // try to extract JSON from the text body
  }

  const firstBrace = cleaned.indexOf('{');
  if (firstBrace === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = firstBrace; i < cleaned.length; i += 1) {
    const ch = cleaned[i];

    if (ch === '"' && !escaped) {
      inString = !inString;
    }

    if (ch === '\\' && !escaped) {
      escaped = true;
    } else {
      escaped = false;
    }

    if (!inString) {
      if (ch === '{') {
        depth += 1;
      } else if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          return cleaned.slice(firstBrace, i + 1);
        }
      }
    }
  }

  return null;
};

export const generateMealPlan = async (profile: DietaryProfile): Promise<MealPlan> => {
  const prompt = `Generate a meal plan for a person with the following dietary profile:
  Age: ${profile.age},
  Sex: ${profile.sex},
  Weight: ${profile.weight} kg,
  Height: ${profile.height} cm,
  Activity Level: ${profile.activityLevel},
  Dietary Preferences: ${profile.dietaryPreferences.join(', ')},
  Budget Level: ${profile.budgetLevel}.

Respond with valid JSON only. Do not include any explanation, markdown, or text outside the JSON object.

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
    const rawText = typeof response.text === 'string' ? response.text : '';
    const jsonText = extractJsonString(rawText);

    if (!jsonText) {
      console.error('Failed to extract meal plan JSON from response:', rawText);
      throw new Error('Invalid response format: could not extract JSON');
    }

    try {
      const mealPlan: MealPlan = JSON.parse(jsonText);
      return mealPlan;
    } catch (error) {
      console.error('Failed to parse meal plan response:', error, 'raw:', rawText);
      throw new Error('Failed to parse meal plan response');
    }
  });
};

//create helper function that gets meal plan with price from dietary profile. It should return 7 breakfast meals, 7 lunch meals and 7 dinner meals all in the format of the MealPlanWithPrice type. The prompt should be similar to the one in generateMealPlan but it should also include the price of each meal and the total price of the meal plan. The response should be in the following json format:
/*
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
      ],
      "price": number
    }
  ],
  "totalPrice": number
}
*/
export const generateMealPlanWithPrice = async (profile: DietaryProfile): Promise<MealPlanWithPrice> => {
  const prompt = `Generate a meal plan with price for a person with the following dietary profile:
  Age: ${profile.age},
  Sex: ${profile.sex},
  Weight: ${profile.weight} kg,
  Height: ${profile.height} cm,
  Activity Level: ${profile.activityLevel},
  Dietary Preferences: ${profile.dietaryPreferences.join(', ')},
  Budget Level: ${profile.budgetLevel}.
Respond with valid JSON only. Do not include any explanation, markdown, or text outside the JSON object.
The meal plan should meet the person's dietary needs and preferences while staying within their calorie and financial budget.
Please return 7 breakfast meals, 7 lunch meals and 7 dinner meals. The response should be in the following json format:
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
      ],
      "price": number
    }
  ],
  "totalPrice": number
}`;
  return await generateText({
    model: openai('gpt-4o'),
    prompt: prompt,
  }).then(response => {
    const rawText = typeof response.text === 'string' ? response.text : '';
    const jsonText = extractJsonString(rawText);

    if (!jsonText) {
      console.error('Failed to extract meal plan JSON from response:', rawText);
      throw new Error('Invalid response format: could not extract JSON');
    }

    try {
      const mealPlanWithPrice: MealPlanWithPrice = JSON.parse(jsonText);
      return mealPlanWithPrice;
    } catch (error) {
      console.error('Failed to parse meal plan response:', error, 'raw:', rawText);
      throw new Error('Failed to parse meal plan response');
    }
  });

};


