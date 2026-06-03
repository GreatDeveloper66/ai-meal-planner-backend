# ai-meal-planner-backend

A microservice that generates personalized meal plans using the OpenAI API. Part of the Meal Plan & Grocery Discovery application — a full-stack microservice architecture for personalized meal planning and local grocery store discovery.

---

## Overview

This service receives a user's dietary profile and generates a fully structured meal plan using OpenAI's API. It acts as the intelligence layer of the application — translating raw dietary preferences and health data into actionable, day-by-day meal recommendations complete with nutritional information.

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **AI Integration:** OpenAI API

---

## Features

- Generates personalized meal plans based on user dietary profiles
- Structures meal plans with daily meals and nutritional breakdowns
- Supports multiple diet types including keto, vegan, vegetarian, and high protein
- Budget-aware meal plan generation

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/meal-plan/generate` | Generate a meal plan from a user diet profile |

---

## Meal Plan Response Schema

```typescript
{
  id: string
  date: string
  meals: [
    {
      id: string
      name: string
      foods: [
        {
          id: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          quantity: string
        }
      ]
    }
  ]
}
```

---

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
PORT=3003
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- OpenAI API key

### Installation

```bash
git clone https://github.com/yourusername/ai-meal-planner-backend.git
cd ai-meal-planner-backend
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

## Project Architecture

This service is one of six components in the Meal Plan & Grocery Discovery application:

| Service | Responsibility |
|---------|---------------|
| user-auth-service | Authentication & JWT management |
| meal-plan-diet-profile-service | Diet profile storage & management |
| **ai-meal-planner-backend** | AI-powered meal plan generation |
| meal-planner-user-meal-plan-service | User meal plan storage |
| meal-plan-grocery-service | Grocery store discovery via Google API |
| meal-plan-frontend | React frontend |
| meal-planner-backend-for-frontend | BFF orchestration layer |
