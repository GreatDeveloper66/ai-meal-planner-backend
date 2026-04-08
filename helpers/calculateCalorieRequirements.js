//input: user age, weight, height, exercise level, and dietary preferences
//output: recommended daily calorie intake
//age: number, height: number, weight: number, sex: enum, activityLevel: enum: ['sedentary', 'light', 'moderate', 'active', 'very active'],
const userDietProfile = {
    age: Number,
    weight: Number,
    height: Number,
    sex: Enumerator('male', 'female'),
    activityLevel: Enumerator('sedentary', 'light', 'moderate', 'active', 'very active'),
}

export const calculateCalorieRequirements = (userDietProfile) => {
    const { age, weight, height, sex, activityLevel } = userDietProfile;
    let bmr;
    if (sex === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    let activityMultiplier;
    switch (activityLevel) {
        case 'sedentary':   activityMultiplier = 1.2; break;
        case 'light':      activityMultiplier = 1.375; break;
        case 'moderate':   activityMultiplier = 1.55; break;
        case 'active':     activityMultiplier = 1.725; break;
        case 'very active':activityMultiplier = 1.9; break;
        default:          activityMultiplier = 1.2; break;
    }
    return Math.round(bmr * activityMultiplier);
}