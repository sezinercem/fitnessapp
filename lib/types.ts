export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  goal: string | null;
  experience: string | null;
  equipment: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkoutExercise = {
  id: string;
  day_id: string;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  tempo: string | null;
  notes: string | null;
  sort_order: number;
};

export type WorkoutDay = {
  id: string;
  plan_id: string;
  day_name: string;
  sort_order: number;
  is_complete?: boolean;
  workout_exercises: WorkoutExercise[];
};

export type WorkoutPlan = {
  id: string;
  user_id: string;
  name: string;
  goal: string;
  experience: string;
  equipment: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  workout_days: WorkoutDay[];
};

export type NutritionMeal = {
  id: string;
  plan_id: string;
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string | null;
  notes: string | null;
  sort_order: number;
};

export type NutritionPlan = {
  id: string;
  user_id: string;
  goal: string;
  daily_calories: number;
  protein_target: number;
  carbs_target: number;
  fat_target: number;
  meals_per_day: number;
  water_target_liters: number;
  notes: string | null;
  nutrition_meals: NutritionMeal[];
};

export type Exercise = {
  id?: string;
  slug: string;
  name: string;
  muscle_groups: string[];
  equipment: string;
  difficulty: string;
  instructions: string[];
  mistakes: string[];
  safety_tips: string[];
  related: string[];
};
