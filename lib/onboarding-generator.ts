import type { z } from "zod";
import type { onboardingSchema } from "@/lib/validators";
import { categoryExplanations, categoryLabels, getExercisesForCategory, normaliseCategory, type WorkoutCategory } from "@/lib/exercise-catalog";

type Answers = z.infer<typeof onboardingSchema>;

const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const splitByTrainingDays: Record<number, WorkoutCategory[]> = {
  1: ["full_body"],
  2: ["full_body", "full_body"],
  3: ["full_body", "upper", "full_body"],
  4: ["upper", "lower", "upper", "lower"],
  5: ["push", "pull", "legs", "upper", "mobility"],
  6: ["push", "pull", "legs", "push", "pull", "legs"],
  7: ["push", "pull", "legs", "upper", "lower", "cardio", "mobility"]
};

const fiveDayPreferences: Record<string, WorkoutCategory[]> = {
  recommended: ["push", "pull", "legs", "upper", "mobility"],
  ppl_upper_lower: ["push", "pull", "legs", "upper", "lower"],
  upper_lower_ppl: ["upper", "lower", "push", "pull", "legs"],
  full_body_cardio: ["full_body", "cardio", "full_body", "cardio", "full_body"]
};

export function buildGeneratedPlan(answers: Answers) {
  const selectedDays = answers.selectedTrainingDays;
  const customSplit = parseCustomSplit(answers.customSplit);
  const selectedCategories =
    answers.routineType === "Build my own routine"
      ? selectedDays.map((day) => customSplit[day] ?? "full_body")
      : recommendedSplit(answers);
  const trainingDays = new Set(selectedDays.map((day) => week.indexOf(day)));
  let workoutIndex = 0;

  return week.map((day, index) => {
    const isWorkout = trainingDays.has(index);
    const category = isWorkout ? selectedCategories[workoutIndex] ?? "full_body" : "mobility";
    const focus = isWorkout ? categoryLabels[category] : "Rest Day";
    const baseSets = answers.experienceLevel === "Advanced" ? 4 : answers.experienceLevel === "Intermediate" ? 3 : 2;
    const count = isWorkout ? Math.min(6, Math.max(3, Math.round(answers.sessionLength / 12))) : 0;
    if (isWorkout) workoutIndex += 1;
    const catalogExercises = isWorkout ? getExercisesForCategory(category, answers.equipmentAvailable, count) : [];

    return {
      day,
      dayIndex: index,
      focus,
      category,
      isRestDay: !isWorkout || category === "mobility",
      estimatedDuration: isWorkout ? answers.sessionLength : 20,
      whyItExists: isWorkout
        ? `${categoryExplanations[category]} This day matches your selected split and equipment.`
        : "Rest days help you adapt, reduce soreness, and come back stronger for the next session.",
      mainMuscles: isWorkout ? musclesForCategory(category) : ["Recovery", "Mobility"],
      recoveryNotes: isWorkout ? "Keep two reps in reserve on most sets and stop if form breaks." : "Mobility recommendation: 10 minutes of hips, upper back and hamstrings. Walking target: 7,000-10,000 steps. Recovery tips: hydrate, sleep well, and keep stress low.",
      exercises: catalogExercises.map((exercise) => ({
        name: exercise.name,
        muscleGroups: [exercise.primary_muscle_group, ...exercise.secondary_muscle_groups],
        workoutCategory: exercise.workout_category,
        sets: baseSets,
        reps: answers.mainGoal === "Get stronger" ? "5" : "8-12",
        targetWeight: answers.equipmentAvailable === "Bodyweight only" ? "bodyweight" : "Choose a controlled weight",
        restSeconds: answers.mainGoal === "Get stronger" ? 120 : 75,
        notes: exercise.instructions[0] ?? "Start light enough to own every rep."
      }))
    };
  });
}

function recommendedSplit(answers: Answers): WorkoutCategory[] {
  if (answers.selectedTrainingDays.length === 5) {
    return fiveDayPreferences[answers.splitPreference] ?? fiveDayPreferences.recommended;
  }
  return splitByTrainingDays[answers.selectedTrainingDays.length] ?? splitByTrainingDays[3];
}

function parseCustomSplit(value: string | undefined) {
  try {
    return JSON.parse(value || "{}") as Record<string, WorkoutCategory>;
  } catch {
    return {};
  }
}

function musclesForCategory(category: WorkoutCategory) {
  if (category === "push") return ["Chest", "Shoulders", "Triceps"];
  if (category === "pull") return ["Back", "Biceps", "Rear delts"];
  if (category === "legs" || category === "lower") return ["Quads", "Glutes", "Hamstrings", "Calves"];
  if (category === "upper") return ["Chest", "Back", "Shoulders", "Arms"];
  if (category === "cardio") return ["Heart", "Lungs", "Legs"];
  if (category === "mobility") return ["Hips", "Upper back", "Hamstrings"];
  if (category === "core") return ["Core", "Obliques", "Lower back"];
  return ["Full body", "Core"];
}

export function validateGeneratedPlan(days: ReturnType<typeof buildGeneratedPlan>) {
  return days.map((day) => ({
    ...day,
    exercises: day.isRestDay ? [] : day.exercises.filter((exercise) => normaliseCategory(day.focus) === "upper" ? ["upper", "push", "pull"].includes(exercise.workoutCategory) : exercise.workoutCategory === day.category)
  }));
}

export function buildNutrition(answers: Answers) {
  const weight = answers.currentWeight || 75;
  const calorieBias = answers.nutritionGoal === "Fat loss" ? -350 : answers.nutritionGoal === "Muscle gain" ? 250 : answers.nutritionGoal === "Performance" ? 350 : 0;
  const dailyCalories = Math.round(weight * 30 + calorieBias);
  const protein = Math.round(weight * (answers.dietaryPreference === "High protein" ? 2.2 : 1.8));
  const fat = Math.round(weight * 0.8);
  const carbs = Math.max(80, Math.round((dailyCalories - protein * 4 - fat * 9) / 4));

  const meals = [
    {
      mealName: "High-protein breakfast",
      timeOfDay: "Morning",
      foods: answers.dietaryPreference === "Vegan" ? "Tofu scramble, oats, berries" : "Eggs or Greek yogurt, oats, berries",
      calories: Math.round(dailyCalories * 0.28),
      protein: Math.round(protein * 0.3),
      carbs: Math.round(carbs * 0.3),
      fat: Math.round(fat * 0.25),
      purpose: "High-protein breakfast to support muscle repair and reduce cravings."
    },
    {
      mealName: "Balanced lunch",
      timeOfDay: "Midday",
      foods: answers.dietaryPreference === "Vegetarian" ? "Lentil bowl, rice, salad" : "Chicken rice bowl, vegetables, olive oil",
      calories: Math.round(dailyCalories * 0.34),
      protein: Math.round(protein * 0.35),
      carbs: Math.round(carbs * 0.38),
      fat: Math.round(fat * 0.35),
      purpose: "A balanced meal to fuel training and keep energy stable."
    },
    {
      mealName: "Training dinner",
      timeOfDay: "Evening",
      foods: answers.dietaryPreference === "Halal" ? "Halal lean protein, potatoes, vegetables" : "Lean protein, potatoes or pasta, vegetables",
      calories: Math.round(dailyCalories * 0.3),
      protein: Math.round(protein * 0.3),
      carbs: Math.round(carbs * 0.28),
      fat: Math.round(fat * 0.3),
      purpose: "Dinner refills energy stores and supports recovery overnight."
    },
    {
      mealName: "Simple snack",
      timeOfDay: "Anytime",
      foods: "Protein shake, fruit, nuts",
      calories: Math.round(dailyCalories * 0.08),
      protein: Math.max(10, Math.round(protein * 0.05)),
      carbs: Math.round(carbs * 0.04),
      fat: Math.round(fat * 0.1),
      purpose: "A flexible snack to make targets easier without overthinking."
    }
  ];

  return {
    dailyCalories,
    protein,
    carbs,
    fat,
    water: answers.sessionLength >= 60 ? 3.5 : 2.8,
    explanation: `This starter plan fits ${answers.nutritionGoal.toLowerCase()} by matching calories to your goal, keeping protein high, and distributing meals in a simple structure.`,
    meals
  };
}
