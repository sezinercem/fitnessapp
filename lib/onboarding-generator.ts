import type { z } from "zod";
import type { onboardingSchema } from "@/lib/validators";

type Answers = z.infer<typeof onboardingSchema>;

const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const focusByGoal: Record<string, string[]> = {
  "Build muscle": ["Upper Body Hypertrophy", "Lower Body Strength", "Push Muscle Builder", "Pull Muscle Builder", "Legs and Core", "Arms and Conditioning", "Mobility Reset"],
  "Lose fat": ["Full Body Conditioning", "Lower Body Burn", "Upper Body Circuit", "Cardio Strength Mix", "Metabolic Full Body", "Core and Intervals", "Recovery Walk"],
  "Get stronger": ["Upper Body Strength", "Lower Body Strength", "Press and Pull Power", "Squat Pattern Strength", "Posterior Chain", "Heavy Full Body", "Recovery Mobility"],
  "Improve fitness": ["Full Body Fitness", "Cardio Base", "Upper Body Endurance", "Lower Body Endurance", "Core Conditioning", "Hybrid Circuit", "Mobility"],
  "Hybrid athlete": ["Strength and Run Prep", "Upper Strength", "Conditioning Intervals", "Lower Strength", "Athletic Full Body", "Zone 2 Endurance", "Recovery"],
  "General health": ["Full Body Basics", "Walk and Core", "Upper Body Basics", "Lower Body Basics", "Mobility and Balance", "Light Conditioning", "Rest"]
};

const splitByTrainingDays: Record<number, string[]> = {
  1: ["Full Body"],
  2: ["Full Body A", "Full Body B"],
  3: ["Full Body", "Upper-Lower Strength", "Hybrid Conditioning"],
  4: ["Upper Body", "Lower Body", "Upper Strength", "Lower Strength"],
  5: ["Push", "Pull", "Legs", "Upper Accessories", "Conditioning"],
  6: ["Push A", "Pull A", "Legs A", "Push B", "Pull B", "Legs B"],
  7: ["Chest and Triceps", "Back and Biceps", "Leg Strength", "Shoulders and Core", "Posterior Chain", "Conditioning", "Mobility Strength"]
};

const exerciseBank: Record<string, string[]> = {
  "Bodyweight only": ["Push-up", "Bodyweight squat", "Reverse lunge", "Glute bridge", "Plank", "Mountain climber", "Dead bug"],
  Dumbbells: ["Dumbbell bench press", "Goblet squat", "One-arm dumbbell row", "Dumbbell Romanian deadlift", "Dumbbell shoulder press", "Dumbbell lunge", "Farmer carry"],
  Barbell: ["Bench press", "Back squat", "Barbell row", "Romanian deadlift", "Overhead press", "Deadlift", "Front squat"],
  "Full gym": ["Bench press", "Lat pulldown", "Leg press", "Seated row", "Cable pressdown", "Hamstring curl", "Machine chest press"],
  "Home gym": ["Dumbbell press", "Pull-up or band row", "Goblet squat", "Romanian deadlift", "Kettlebell swing", "Split squat", "Plank"],
  "Resistance bands": ["Band chest press", "Band row", "Band squat", "Band pull-apart", "Band Romanian deadlift", "Band curl", "Pallof press"]
};

export function buildGeneratedPlan(answers: Answers) {
  const selectedDays = answers.selectedTrainingDays;
  const split = splitByTrainingDays[selectedDays.length] ?? focusByGoal[answers.mainGoal] ?? splitByTrainingDays[3];
  const exercises = exerciseBank[answers.equipmentAvailable] ?? exerciseBank["Bodyweight only"];
  const trainingDays = new Set(selectedDays.map((day) => week.indexOf(day)));
  let workoutIndex = 0;

  return week.map((day, index) => {
    const isWorkout = trainingDays.has(index);
    const focus = isWorkout ? split[workoutIndex % split.length] : "Rest Day";
    const baseSets = answers.experienceLevel === "Advanced" ? 4 : answers.experienceLevel === "Intermediate" ? 3 : 2;
    const count = isWorkout ? Math.min(6, Math.max(3, Math.round(answers.sessionLength / 12))) : 0;
    const currentWorkoutIndex = workoutIndex;
    if (isWorkout) workoutIndex += 1;

    return {
      day,
      dayIndex: index,
      focus,
      isRestDay: !isWorkout,
      estimatedDuration: isWorkout ? answers.sessionLength : 20,
      whyItExists: isWorkout
        ? `${focus} moves you toward ${answers.mainGoal.toLowerCase()} with a split matched to your selected training days.`
        : "Rest days help you adapt, reduce soreness, and come back stronger for the next session.",
      mainMuscles: isWorkout ? musclesForFocus(focus) : ["Recovery", "Mobility"],
      recoveryNotes: isWorkout ? "Keep two reps in reserve on most sets and stop if form breaks." : "Mobility recommendation: 10 minutes of hips, upper back and hamstrings. Walking target: 7,000-10,000 steps. Recovery tips: hydrate, sleep well, and keep stress low.",
      exercises: isWorkout
        ? Array.from({ length: count }, (_, exerciseIndex) => ({
            name: exercises[(currentWorkoutIndex + exerciseIndex) % exercises.length],
            muscleGroups: musclesForFocus(focus),
            sets: baseSets,
            reps: answers.mainGoal === "Get stronger" ? "5" : "8-12",
            targetWeight: answers.equipmentAvailable === "Bodyweight only" ? "bodyweight" : "Choose a controlled weight",
            restSeconds: answers.mainGoal === "Get stronger" ? 120 : 75,
            notes: "Start light enough to own every rep."
          }))
        : []
    };
  });
}

function musclesForFocus(focus: string) {
  if (focus.includes("Upper") || focus.includes("Push") || focus.includes("Chest")) return ["Chest", "Shoulders", "Triceps"];
  if (focus.includes("Pull") || focus.includes("Back")) return ["Back", "Biceps", "Rear delts"];
  if (focus.includes("Leg") || focus.includes("Lower") || focus.includes("Posterior")) return ["Quads", "Glutes", "Hamstrings"];
  if (focus.includes("Core") || focus.includes("Mobility")) return ["Core", "Hips", "Mobility"];
  return ["Full body", "Core"];
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
