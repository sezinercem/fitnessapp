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
  equipment: text(80)
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
