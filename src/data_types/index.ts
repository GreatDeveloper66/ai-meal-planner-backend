import { Request, Response } from 'express';

export type DietaryProfile = {
  age: number;
  sex: "male" | "female" | "other";
  weight: number;
  height: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very active";
  dietaryPreferences: string[];
  budgetLevel: "low" | "normal" | "high";
}

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity?: string;
};

export type Meal = {
  id: string;
  name: "breakfast" | "lunch" | "dinner";
  foods: FoodItem[];
};

export type MealPlan = {
  id: string;
  date: string; // ISO date string
  meals: Meal[];
};

type MealImage = {
  mealImageUrl: string;
};

export type MealPlanImages = {
  MealPlanImagesUrls: MealImage[];
}

export type TestGPTRequestBody = {
  prompt?: string;
};

export type TestGPTResponseBody = {
  text: string;
} | {
  error: string;
};

export type TestDalleRequestBody = {
  prompt?: string;
};

export type TestDalleResponseBody = {
  imageUrl: string;
} | {
  error: string;
};

export type TestGPTRequest = Request<{}, {}, TestGPTRequestBody>;
export type TestGPTResponse = Response<TestGPTResponseBody>;
export type TestDalleRequest = Request<{}, {}, TestDalleRequestBody>;
export type TestDalleResponse = Response<TestDalleResponseBody>;

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type DietaryProfileRequest = Request<{}, {}, DietaryProfile>;

export type MealPlanResponseBody = {
  mealPlan: MealPlan;
};

export type MealPlanResponse = Response<MealPlanResponseBody>;

export type MealPlanRequest = Request<{}, {}, MealPlan>;

export type MealPlanImagesResponseBody = {
  mealPlanImages: MealPlanImages;
};

export type MealPlanImagesResponse = Response<MealPlanImagesResponseBody>;



