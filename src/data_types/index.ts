// src/data_types/index.ts

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface TestGPTRequest {
  prompt?: string;
}

export interface TestDalleRequest {
  prompt?: string;
}

export interface GPTResponse {
  text: string;
}

export interface DalleResponse {
  imageUrl: string;
}

// Express type extensions
import { Request } from 'express';

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface TypedResponse<T> extends Express.Response {
  json: (body: T) => this;
}

export type DietaryProfile = {
  age: number;
  sex: "male" | "female" | "other";
  weight: number;
  height: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very active";
  dietaryPreferences: string[];
  budgetLevel: "low" | "normal" | "high";
}