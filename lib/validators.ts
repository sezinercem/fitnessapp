import { z } from "zod";
import { cleanText } from "@/lib/security";

const text = (max = 120) => z.string().max(max).transform((value) => cleanText(value, max));
const requiredText = (max = 120, min = 2) =>
  z.string().min(min).max(max).transform((value) => cleanText(value, max));

export const authSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(100)
});

export const signupSchema = authSchema.extend({
  fullName: text(80).optional()
});

export const profileSchema = z.object({
  fullName: text(80),
  goal: text(40),
  experience: text(40),
  equipment: text(80),
  defaultWeightUnit: z.enum(["kg", "lb"]).default("kg")
});

export const recommendationSchema = z.object({
  goal: z.enum(["fat loss", "muscle gain", "strength", "endurance", "mobility", "general fitness"]),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  equipment: z.enum(["bodyweight", "dumbbells", "barbell", "gym", "resistance bands", "full home gym"])
});

export const planSchema = z.object({
  name: requiredText(100),
  goal: text(60),
  experience: text(40),
  equipment: text(80)
});

export const daySchema = z.object({
  planId: z.string().uuid(),
  dayName: requiredText(80)
});

export const exerciseSchema = z.object({
  dayId: z.string().uuid(),
  exerciseName: requiredText(100),
  sets: z.coerce.number().int().min(1).max(12),
  reps: text(30),
  restSeconds: z.coerce.number().int().min(15).max(600),
  tempo: text(30).optional(),
  notes: text(300).optional()
});

export const nutritionSchema = z.object({
  goal: text(80),
  dailyCalories: z.coerce.number().int().min(800).max(8000),
  proteinTarget: z.coerce.number().int().min(0).max(500),
  carbsTarget: z.coerce.number().int().min(0).max(900),
  fatTarget: z.coerce.number().int().min(0).max(400),
  mealsPerDay: z.coerce.number().int().min(1).max(10),
  waterTargetLiters: z.coerce.number().min(0.5).max(12),
  notes: text(500).optional()
});

export const mealSchema = z.object({
  planId: z.string().uuid(),
  mealName: requiredText(100),
  calories: z.coerce.number().int().min(0).max(4000),
  protein: z.coerce.number().int().min(0).max(300),
  carbs: z.coerce.number().int().min(0).max(500),
  fat: z.coerce.number().int().min(0).max(250),
  ingredients: text(500).optional(),
  notes: text(300).optional()
});

export const onboardingSchema = z.object({
  mainGoal: z.enum(["Build muscle", "Lose fat", "Get stronger", "Improve fitness", "Hybrid athlete", "General health"]),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  selectedTrainingDays: z.preprocess((value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return value.split(",").map((day) => day.trim()).filter(Boolean);
    return [];
  }, z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])).min(1).max(7)),
  routineType: z.enum(["Use Apex recommendation", "Build my own routine"]).default("Use Apex recommendation"),
  splitPreference: z.enum(["recommended", "ppl_upper_lower", "upper_lower_ppl", "full_body_cardio"]).default("recommended"),
  customSplit: text(1000).optional(),
  equipmentAvailable: z.enum(["Bodyweight only", "Dumbbells", "Barbell", "Full gym", "Home gym", "Resistance bands"]),
  sessionLength: z.coerce.number().int().min(20).max(90),
  nutritionGoal: z.enum(["Fat loss", "Maintenance", "Muscle gain", "Performance"]),
  dietaryPreference: z.enum(["No preference", "High protein", "Vegetarian", "Vegan", "Halal", "Gluten free"]),
  currentWeight: z.coerce.number().min(25).max(350),
  targetWeight: z.coerce.number().min(25).max(350),
  height: z.coerce.number().min(100).max(250),
  age: z.coerce.number().int().min(13).max(100)
});

export const trackingSetSchema = z.object({
  workoutLogId: z.string().uuid(),
  exerciseName: requiredText(100),
  setNumber: z.coerce.number().int().min(1).max(20),
  weight: text(30).optional(),
  reps: z.coerce.number().int().min(0).max(200),
  restSeconds: z.coerce.number().int().min(0).max(900),
  rpe: z.coerce.number().min(1).max(10),
  notes: text(400).optional(),
  isComplete: z.coerce.boolean().optional()
});

export const sessionSetSchema = z.object({
  workoutSessionId: z.string().uuid(),
  workoutSessionExerciseId: z.string().uuid(),
  exerciseName: requiredText(100),
  setNumber: z.coerce.number().int().min(1).max(30),
  weight: text(30).optional(),
  weightUnit: z.enum(["kg", "lb"]),
  reps: z.coerce.number().int().min(0).max(300),
  restSeconds: z.coerce.number().int().min(0).max(1200),
  rpe: z.coerce.number().min(1).max(10),
  notes: text(500).optional()
});

export const finishSessionSchema = z.object({
  notes: text(700).optional()
});

export const bodyWeightSchema = z.object({
  weight: z.coerce.number().min(25).max(350),
  notes: text(300).optional()
});

export const measurementSchema = z.object({
  chest: z.coerce.number().min(0).max(300).optional(),
  waist: z.coerce.number().min(0).max(300).optional(),
  hips: z.coerce.number().min(0).max(300).optional(),
  arm: z.coerce.number().min(0).max(150).optional(),
  thigh: z.coerce.number().min(0).max(200).optional(),
  notes: text(300).optional()
});

export const easyMealSchema = z.object({
  nutritionTargetId: z.string().uuid(),
  mealName: requiredText(100),
  timeOfDay: requiredText(40),
  foods: text(700),
  calories: z.coerce.number().int().min(0).max(4000),
  protein: z.coerce.number().int().min(0).max(300),
  carbs: z.coerce.number().int().min(0).max(500),
  fat: z.coerce.number().int().min(0).max(250),
  purpose: text(300).optional(),
  notes: text(300).optional()
});

export const trainingDaySchema = z.object({
  trainingFocus: requiredText(100),
  workoutCategory: z.enum(["push", "pull", "legs", "upper", "lower", "full_body", "cardio", "mobility", "core"]).default("full_body"),
  dayOfWeek: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  isRestDay: z.coerce.boolean(),
  estimatedDuration: z.coerce.number().int().min(10).max(180),
  whyItExists: text(600),
  recoveryNotes: text(400).optional()
});

export const plannedExerciseSchema = z.object({
  trainingDayId: z.string().uuid(),
  exerciseName: requiredText(100),
  muscleGroups: text(200),
  confirmMismatch: z.coerce.boolean().optional(),
  sets: z.coerce.number().int().min(1).max(12),
  reps: text(40),
  targetWeight: text(50).optional(),
  restSeconds: z.coerce.number().int().min(0).max(900),
  notes: text(400).optional()
});
