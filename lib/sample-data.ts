import type { Exercise } from "@/lib/types";

export const planTemplates = [
  {
    name: "Fat loss beginner",
    goal: "fat loss",
    experience: "beginner",
    equipment: "bodyweight",
    days: [
      { dayName: "Full-body circuit", exercises: [["Squat to reach", 3, "12", 45], ["Incline push-up", 3, "10", 45], ["Mountain climber", 3, "30 sec", 45]] },
      { dayName: "Cardio and core", exercises: [["Step-back lunge", 3, "10/side", 45], ["Dead bug", 3, "12/side", 30], ["Fast walk intervals", 5, "2 min", 60]] }
    ]
  },
  {
    name: "Muscle gain beginner",
    goal: "muscle gain",
    experience: "beginner",
    equipment: "dumbbells",
    days: [
      { dayName: "Upper body", exercises: [["Dumbbell press", 4, "8-10", 90], ["One-arm row", 4, "10/side", 75], ["Lateral raise", 3, "12", 60]] },
      { dayName: "Lower body", exercises: [["Goblet squat", 4, "10", 90], ["Romanian deadlift", 4, "10", 90], ["Calf raise", 3, "15", 45]] }
    ]
  },
  {
    name: "Strength training",
    goal: "strength",
    experience: "intermediate",
    equipment: "barbell",
    days: [
      { dayName: "Squat strength", exercises: [["Back squat", 5, "5", 180], ["Romanian deadlift", 4, "6", 150], ["Plank", 3, "45 sec", 60]] },
      { dayName: "Press strength", exercises: [["Bench press", 5, "5", 180], ["Barbell row", 4, "6", 150], ["Overhead press", 3, "6", 120]] }
    ]
  },
  {
    name: "Hybrid athlete",
    goal: "endurance",
    experience: "intermediate",
    equipment: "gym",
    days: [
      { dayName: "Power and intervals", exercises: [["Trap bar deadlift", 4, "4", 150], ["Bike sprint", 8, "20 sec", 70], ["Farmer carry", 4, "30 m", 90]] },
      { dayName: "Tempo conditioning", exercises: [["Kettlebell swing", 5, "15", 75], ["Push-up", 4, "AMRAP", 60], ["Zone 2 run", 1, "35 min", 0]] }
    ]
  },
  {
    name: "Home dumbbell plan",
    goal: "general fitness",
    experience: "beginner",
    equipment: "dumbbells",
    days: [
      { dayName: "Home strength", exercises: [["Goblet squat", 3, "12", 75], ["Floor press", 3, "10", 75], ["Renegade row", 3, "8/side", 75]] }
    ]
  },
  {
    name: "Gym 4-day split",
    goal: "muscle gain",
    experience: "intermediate",
    equipment: "gym",
    days: [
      { dayName: "Push", exercises: [["Bench press", 4, "8", 120], ["Incline dumbbell press", 3, "10", 90], ["Cable triceps pressdown", 3, "12", 60]] },
      { dayName: "Pull", exercises: [["Lat pulldown", 4, "10", 90], ["Seated row", 4, "10", 90], ["Dumbbell curl", 3, "12", 60]] },
      { dayName: "Legs", exercises: [["Back squat", 4, "8", 120], ["Leg press", 3, "12", 90], ["Hamstring curl", 3, "12", 60]] },
      { dayName: "Upper pump", exercises: [["Machine chest press", 3, "12", 75], ["Cable row", 3, "12", 75], ["Lateral raise", 4, "15", 45]] }
    ]
  },
  {
    name: "Mobility and recovery",
    goal: "mobility",
    experience: "beginner",
    equipment: "bodyweight",
    days: [
      { dayName: "Mobility flow", exercises: [["World's greatest stretch", 3, "6/side", 30], ["Hip airplane", 3, "6/side", 45], ["Breathing reset", 1, "5 min", 0]] }
    ]
  }
];

export const exercises: Exercise[] = [
  {
    slug: "back-squat",
    name: "Back Squat",
    muscle_groups: ["Quads", "Glutes", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: ["Brace before unracking", "Sit between the hips with knees tracking toes", "Drive through the mid-foot to stand tall"],
    mistakes: ["Knees collapsing inward", "Losing brace at the bottom", "Good-morning the weight up"],
    safety_tips: ["Use safeties", "Keep reps crisp", "Stop before form breaks"],
    related: ["Goblet Squat", "Leg Press", "Romanian Deadlift"]
  },
  {
    slug: "dumbbell-press",
    name: "Dumbbell Press",
    muscle_groups: ["Chest", "Shoulders", "Triceps"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    instructions: ["Set shoulder blades back", "Lower dumbbells under control", "Press up while keeping wrists stacked"],
    mistakes: ["Flaring elbows too wide", "Bouncing the weights", "Overarching the lower back"],
    safety_tips: ["Start light", "Use a controlled setup", "Keep feet planted"],
    related: ["Bench Press", "Incline Dumbbell Press", "Push-up"]
  },
  {
    slug: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscle_groups: ["Hamstrings", "Glutes", "Back"],
    equipment: "Barbell or dumbbells",
    difficulty: "Intermediate",
    instructions: ["Soften knees", "Hinge hips back", "Keep lats tight and stand by squeezing glutes"],
    mistakes: ["Rounding the back", "Squatting instead of hinging", "Letting the weight drift forward"],
    safety_tips: ["Keep load close", "Own the bottom position", "Avoid chasing range with a rounded spine"],
    related: ["Back Squat", "Hip Thrust", "Hamstring Curl"]
  },
  {
    slug: "push-up",
    name: "Push-up",
    muscle_groups: ["Chest", "Core", "Triceps"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: ["Create a straight line from head to heel", "Lower chest toward the floor", "Push the floor away without sagging"],
    mistakes: ["Dropping hips", "Shrugging shoulders", "Half reps"],
    safety_tips: ["Elevate hands if needed", "Keep ribs down", "Stop at pain-free depth"],
    related: ["Incline Push-up", "Dumbbell Press", "Bench Press"]
  }
];
