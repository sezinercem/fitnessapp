export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  goal: string | null;
  experience: string | null;
  equipment: string | null;
  default_weight_unit?: "kg" | "lb" | null;
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

export type OnboardingAnswers = {
  id: string;
  user_id: string;
  main_goal: string;
  experience_level: string;
  training_days_per_week: number;
  selected_training_days?: string[] | null;
  routine_type?: string | null;
  split_preference?: string | null;
  custom_split?: Record<string, string> | null;
  equipment_available: string;
  session_length: number;
  nutrition_goal: string;
  dietary_preference: string;
  current_weight: number | null;
  target_weight: number | null;
  height: number | null;
  age: number | null;
};

export type PlannedExercise = {
  id: string;
  training_day_id: string;
  exercise_name: string;
  muscle_groups: string[];
  workout_category?: string | null;
  sets: number;
  reps: string;
  target_weight: string | null;
  rest_seconds: number;
  notes: string | null;
  sort_order: number;
};

export type TrainingDay = {
  id: string;
  weekly_plan_id: string;
  day_of_week: string;
  day_index: number;
  training_focus: string;
  workout_category?: string | null;
  is_rest_day: boolean;
  estimated_duration: number;
  why_it_exists: string;
  main_muscles: string[];
  recovery_notes: string | null;
  planned_exercises: PlannedExercise[];
};

export type WeeklyTrainingPlan = {
  id: string;
  user_id: string;
  plan_name: string;
  goal: string;
  difficulty_level: string;
  expected_outcome: string;
  weekly_structure: string;
  training_days: TrainingDay[];
};

export type NutritionTarget = {
  id: string;
  user_id: string;
  goal: string;
  daily_calories: number;
  protein_target: number;
  carbs_target: number;
  fat_target: number;
  water_target_liters: number;
  explanation: string | null;
};

export type Meal = {
  id: string;
  user_id: string;
  nutrition_target_id: string;
  meal_name: string;
  time_of_day: string;
  foods: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  purpose: string | null;
  notes: string | null;
  sort_order: number;
};

export type WorkoutSet = {
  id: string;
  workout_log_id: string;
  workout_session_id?: string | null;
  workout_session_exercise_id?: string | null;
  exercise_name: string;
  set_number: number;
  weight: string | null;
  weight_unit?: "kg" | "lb";
  reps: number | null;
  rest_seconds: number | null;
  rpe: number | null;
  notes: string | null;
  is_complete: boolean;
};

export type WorkoutSession = {
  id: string;
  user_id: string;
  training_day_id: string;
  date: string;
  day_of_week: string;
  workout_name: string;
  status: "started" | "completed" | "skipped";
  started_at: string;
  completed_at: string | null;
  notes: string | null;
};

export type WorkoutSessionExercise = {
  id: string;
  workout_session_id: string;
  planned_exercise_id: string | null;
  exercise_name: string;
  exercise_order: number;
  status: "started" | "completed" | "skipped";
  planned_sets: number;
  planned_reps: string | null;
  notes: string | null;
};

export type SessionSet = {
  id: string;
  workout_session_id: string;
  workout_session_exercise_id: string | null;
  exercise_name: string;
  set_number: number;
  weight: string | null;
  weight_unit: "kg" | "lb";
  reps: number | null;
  rest_seconds: number | null;
  rpe: number | null;
  notes: string | null;
  is_complete: boolean;
};
