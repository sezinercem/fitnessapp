export type WorkoutCategory =
  | "push"
  | "pull"
  | "legs"
  | "upper"
  | "lower"
  | "full_body"
  | "cardio"
  | "mobility"
  | "core";

export type CatalogExercise = {
  name: string;
  primary_muscle_group: string;
  secondary_muscle_groups: string[];
  movement_pattern: string;
  workout_category: WorkoutCategory;
  equipment: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructions: string[];
};

export const categoryLabels: Record<WorkoutCategory, string> = {
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  upper: "Upper Body",
  lower: "Lower Body",
  full_body: "Full Body",
  cardio: "Cardio",
  mobility: "Mobility",
  core: "Core"
};

export const categoryExplanations: Record<WorkoutCategory, string> = {
  push: "Push days train chest, shoulders and triceps.",
  pull: "Pull days train back, rear delts, traps and biceps.",
  legs: "Leg days train quads, hamstrings, glutes and calves.",
  upper: "Upper body days balance chest, back, shoulders and arms.",
  lower: "Lower body days build quads, hamstrings, glutes and calves.",
  full_body: "Full body days train the main movement patterns in one session.",
  cardio: "Cardio days improve conditioning, heart health and work capacity.",
  mobility: "Mobility days improve recovery, movement quality and stiffness.",
  core: "Core days train trunk strength, stability and control."
};

export const exerciseCatalog: CatalogExercise[] = [
  { name: "Bench Press", primary_muscle_group: "Chest", secondary_muscle_groups: ["Triceps", "Shoulders"], movement_pattern: "horizontal push", workout_category: "push", equipment: ["Barbell", "Full gym"], difficulty: "Intermediate", instructions: ["Set shoulder blades back", "Lower under control", "Press up with wrists stacked"] },
  { name: "Incline Dumbbell Press", primary_muscle_group: "Upper chest", secondary_muscle_groups: ["Shoulders", "Triceps"], movement_pattern: "incline push", workout_category: "push", equipment: ["Dumbbells", "Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Set a slight incline", "Lower dumbbells smoothly", "Press without flaring elbows"] },
  { name: "Shoulder Press", primary_muscle_group: "Shoulders", secondary_muscle_groups: ["Triceps"], movement_pattern: "vertical push", workout_category: "push", equipment: ["Dumbbells", "Barbell", "Full gym", "Home gym"], difficulty: "Intermediate", instructions: ["Brace ribs down", "Press overhead", "Control the lower"] },
  { name: "Lateral Raises", primary_muscle_group: "Side delts", secondary_muscle_groups: ["Upper traps"], movement_pattern: "shoulder abduction", workout_category: "push", equipment: ["Dumbbells", "Resistance bands", "Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Raise to shoulder height", "Keep elbows soft", "Lower slowly"] },
  { name: "Chest Press", primary_muscle_group: "Chest", secondary_muscle_groups: ["Triceps", "Shoulders"], movement_pattern: "machine push", workout_category: "push", equipment: ["Full gym"], difficulty: "Beginner", instructions: ["Set seat height", "Press handles forward", "Control the return"] },
  { name: "Tricep Pushdown", primary_muscle_group: "Triceps", secondary_muscle_groups: [], movement_pattern: "elbow extension", workout_category: "push", equipment: ["Full gym", "Resistance bands"], difficulty: "Beginner", instructions: ["Pin elbows", "Extend arms", "Squeeze triceps"] },
  { name: "Dips", primary_muscle_group: "Chest", secondary_muscle_groups: ["Triceps", "Shoulders"], movement_pattern: "bodyweight push", workout_category: "push", equipment: ["Bodyweight only", "Full gym", "Home gym"], difficulty: "Intermediate", instructions: ["Lean slightly forward", "Lower under control", "Press tall"] },
  { name: "Push-ups", primary_muscle_group: "Chest", secondary_muscle_groups: ["Core", "Triceps"], movement_pattern: "bodyweight push", workout_category: "push", equipment: ["Bodyweight only", "Home gym"], difficulty: "Beginner", instructions: ["Keep a straight line", "Lower chest", "Push floor away"] },

  { name: "Lat Pulldown", primary_muscle_group: "Lats", secondary_muscle_groups: ["Biceps", "Upper back"], movement_pattern: "vertical pull", workout_category: "pull", equipment: ["Full gym"], difficulty: "Beginner", instructions: ["Pull elbows down", "Keep chest tall", "Control the cable"] },
  { name: "Pull-ups", primary_muscle_group: "Lats", secondary_muscle_groups: ["Biceps", "Core"], movement_pattern: "vertical pull", workout_category: "pull", equipment: ["Bodyweight only", "Full gym", "Home gym"], difficulty: "Advanced", instructions: ["Start from a dead hang", "Pull chest toward bar", "Lower with control"] },
  { name: "Seated Row", primary_muscle_group: "Mid back", secondary_muscle_groups: ["Biceps", "Rear delts"], movement_pattern: "horizontal pull", workout_category: "pull", equipment: ["Full gym"], difficulty: "Beginner", instructions: ["Sit tall", "Pull elbows back", "Pause and control"] },
  { name: "Barbell Row", primary_muscle_group: "Back", secondary_muscle_groups: ["Biceps", "Hamstrings"], movement_pattern: "hinge row", workout_category: "pull", equipment: ["Barbell", "Full gym"], difficulty: "Intermediate", instructions: ["Hinge hips", "Pull bar to ribs", "Keep spine neutral"] },
  { name: "Face Pulls", primary_muscle_group: "Rear delts", secondary_muscle_groups: ["Traps", "Rotator cuff"], movement_pattern: "rear delt pull", workout_category: "pull", equipment: ["Full gym", "Resistance bands"], difficulty: "Beginner", instructions: ["Pull toward face", "Elbows high", "Squeeze rear delts"] },
  { name: "Rear Delt Fly", primary_muscle_group: "Rear delts", secondary_muscle_groups: ["Upper back"], movement_pattern: "rear delt isolation", workout_category: "pull", equipment: ["Dumbbells", "Full gym", "Resistance bands"], difficulty: "Beginner", instructions: ["Hinge slightly", "Open arms", "Control the return"] },
  { name: "Bicep Curl", primary_muscle_group: "Biceps", secondary_muscle_groups: ["Forearms"], movement_pattern: "elbow flexion", workout_category: "pull", equipment: ["Dumbbells", "Barbell", "Resistance bands", "Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Keep elbows still", "Curl smoothly", "Lower slowly"] },
  { name: "Hammer Curl", primary_muscle_group: "Biceps", secondary_muscle_groups: ["Forearms"], movement_pattern: "neutral curl", workout_category: "pull", equipment: ["Dumbbells", "Resistance bands", "Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Use neutral grip", "Curl without swinging", "Lower under control"] },

  { name: "Squat", primary_muscle_group: "Quads", secondary_muscle_groups: ["Glutes", "Core"], movement_pattern: "squat", workout_category: "legs", equipment: ["Barbell", "Dumbbells", "Bodyweight only", "Full gym", "Home gym"], difficulty: "Intermediate", instructions: ["Brace", "Sit between hips", "Drive through mid-foot"] },
  { name: "Leg Press", primary_muscle_group: "Quads", secondary_muscle_groups: ["Glutes"], movement_pattern: "machine squat", workout_category: "legs", equipment: ["Full gym"], difficulty: "Beginner", instructions: ["Set foot stance", "Lower under control", "Press without locking hard"] },
  { name: "Romanian Deadlift", primary_muscle_group: "Hamstrings", secondary_muscle_groups: ["Glutes", "Back"], movement_pattern: "hinge", workout_category: "legs", equipment: ["Barbell", "Dumbbells", "Full gym", "Home gym"], difficulty: "Intermediate", instructions: ["Soften knees", "Hinge hips back", "Squeeze glutes to stand"] },
  { name: "Walking Lunges", primary_muscle_group: "Quads", secondary_muscle_groups: ["Glutes", "Hamstrings"], movement_pattern: "single leg", workout_category: "legs", equipment: ["Dumbbells", "Bodyweight only", "Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Step long", "Lower with control", "Drive through front foot"] },
  { name: "Leg Extension", primary_muscle_group: "Quads", secondary_muscle_groups: [], movement_pattern: "knee extension", workout_category: "legs", equipment: ["Full gym"], difficulty: "Beginner", instructions: ["Set knee joint", "Extend smoothly", "Control down"] },
  { name: "Hamstring Curl", primary_muscle_group: "Hamstrings", secondary_muscle_groups: [], movement_pattern: "knee flexion", workout_category: "legs", equipment: ["Full gym", "Resistance bands"], difficulty: "Beginner", instructions: ["Curl heel toward glutes", "Pause", "Lower slowly"] },
  { name: "Calf Raises", primary_muscle_group: "Calves", secondary_muscle_groups: [], movement_pattern: "plantar flexion", workout_category: "legs", equipment: ["Dumbbells", "Bodyweight only", "Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Rise tall", "Pause at top", "Lower to stretch"] },
  { name: "Hip Thrusts", primary_muscle_group: "Glutes", secondary_muscle_groups: ["Hamstrings"], movement_pattern: "hip extension", workout_category: "legs", equipment: ["Barbell", "Dumbbells", "Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Set upper back", "Drive hips up", "Squeeze glutes"] },

  { name: "Dumbbell Bench Press", primary_muscle_group: "Chest", secondary_muscle_groups: ["Triceps", "Shoulders"], movement_pattern: "horizontal push", workout_category: "upper", equipment: ["Dumbbells", "Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Set shoulders", "Lower dumbbells", "Press evenly"] },
  { name: "One-arm Dumbbell Row", primary_muscle_group: "Back", secondary_muscle_groups: ["Biceps"], movement_pattern: "horizontal pull", workout_category: "upper", equipment: ["Dumbbells", "Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Brace on bench", "Pull elbow to hip", "Lower slowly"] },
  { name: "Goblet Squat", primary_muscle_group: "Quads", secondary_muscle_groups: ["Glutes", "Core"], movement_pattern: "squat", workout_category: "full_body", equipment: ["Dumbbells", "Home gym", "Full gym"], difficulty: "Beginner", instructions: ["Hold weight high", "Squat between hips", "Stand tall"] },
  { name: "Farmer Carry", primary_muscle_group: "Core", secondary_muscle_groups: ["Traps", "Grip"], movement_pattern: "loaded carry", workout_category: "full_body", equipment: ["Dumbbells", "Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Stand tall", "Walk controlled", "Keep ribs down"] },
  { name: "Bike Intervals", primary_muscle_group: "Heart", secondary_muscle_groups: ["Quads"], movement_pattern: "conditioning", workout_category: "cardio", equipment: ["Full gym", "Home gym"], difficulty: "Beginner", instructions: ["Warm up", "Alternate hard and easy rounds", "Cool down"] },
  { name: "Incline Walk", primary_muscle_group: "Heart", secondary_muscle_groups: ["Calves", "Glutes"], movement_pattern: "steady cardio", workout_category: "cardio", equipment: ["Full gym", "Bodyweight only"], difficulty: "Beginner", instructions: ["Choose steady pace", "Keep nasal breathing possible", "Stay relaxed"] },
  { name: "World's Greatest Stretch", primary_muscle_group: "Hips", secondary_muscle_groups: ["Thoracic spine", "Hamstrings"], movement_pattern: "mobility", workout_category: "mobility", equipment: ["Bodyweight only", "Home gym"], difficulty: "Beginner", instructions: ["Step into lunge", "Rotate chest open", "Switch sides"] },
  { name: "Dead Bug", primary_muscle_group: "Core", secondary_muscle_groups: ["Hip flexors"], movement_pattern: "anti-extension", workout_category: "core", equipment: ["Bodyweight only", "Home gym"], difficulty: "Beginner", instructions: ["Press back down", "Reach opposite limbs", "Move slowly"] }
];

export function normaliseCategory(focus: string): WorkoutCategory {
  const lower = focus.toLowerCase();
  if (lower.includes("push") || lower.includes("chest") || lower.includes("tricep")) return "push";
  if (lower.includes("pull") || lower.includes("back") || lower.includes("bicep")) return "pull";
  if (lower.includes("leg")) return "legs";
  if (lower.includes("lower") || lower.includes("posterior")) return "lower";
  if (lower.includes("upper")) return "upper";
  if (lower.includes("cardio") || lower.includes("conditioning")) return "cardio";
  if (lower.includes("mobility") || lower.includes("rest")) return "mobility";
  if (lower.includes("core")) return "core";
  return "full_body";
}

export function isExerciseCompatible(exerciseName: string, category: WorkoutCategory) {
  const exercise = exerciseCatalog.find((item) => item.name.toLowerCase() === exerciseName.toLowerCase());
  if (!exercise) return true;
  if (category === "upper") return ["upper", "push", "pull"].includes(exercise.workout_category);
  if (category === "lower") return ["lower", "legs"].includes(exercise.workout_category);
  if (category === "full_body") return ["full_body", "push", "pull", "legs", "core"].includes(exercise.workout_category);
  return exercise.workout_category === category;
}

export function getExerciseCategory(exerciseName: string) {
  return exerciseCatalog.find((item) => item.name.toLowerCase() === exerciseName.toLowerCase())?.workout_category;
}

export function getExercisesForCategory(category: WorkoutCategory, equipment: string, limit = 6) {
  const compatible = exerciseCatalog.filter((exercise) => {
    const categoryMatch =
      category === "upper"
        ? ["upper", "push", "pull"].includes(exercise.workout_category)
        : category === "lower"
          ? ["lower", "legs"].includes(exercise.workout_category)
          : category === "full_body"
            ? ["full_body", "push", "pull", "legs", "core"].includes(exercise.workout_category)
            : exercise.workout_category === category;
    const equipmentMatch =
      exercise.equipment.includes(equipment) ||
      exercise.equipment.includes("Bodyweight only") ||
      equipment === "Full gym";
    return categoryMatch && equipmentMatch;
  });
  return compatible.slice(0, limit);
}
