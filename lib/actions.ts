"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/security";
import {
  authSchema,
  bodyWeightSchema,
  daySchema,
  easyMealSchema,
  exerciseSchema,
  mealSchema,
  measurementSchema,
  nutritionSchema,
  onboardingSchema,
  plannedExerciseSchema,
  planSchema,
  profileSchema,
  signupSchema,
  trainingDaySchema,
  trackingSetSchema
} from "@/lib/validators";
import { planTemplates } from "@/lib/sample-data";
import { buildGeneratedPlan, buildNutrition } from "@/lib/onboarding-generator";

async function currentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");
  return { supabase, user };
}

export async function signInAction(formData: FormData) {
  await rateLimit("login", 5);
  const parsed = authSchema.parse({
    email: formData.get("email"),
    password: formData.get("password")
  });
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed);
  if (error) return { error: error.message };
  redirect("/onboarding");
}

export async function signUpAction(formData: FormData) {
  await rateLimit("signup", 4);
  const parsed = signupSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName")
  });
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password
  });
  if (error) return { error: error.message };

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email: parsed.email,
      full_name: parsed.fullName || null
    });
  }

  redirect("/dashboard");
}

export async function forgotPasswordAction(formData: FormData) {
  await rateLimit("forgot-password", 3);
  const email = authSchema.pick({ email: true }).parse({ email: formData.get("email") }).email;
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { error: error.message };
  return { success: "Password reset email requested." };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function completeOnboardingAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = onboardingSchema.parse({
    mainGoal: formData.get("mainGoal"),
    experienceLevel: formData.get("experienceLevel"),
    trainingDaysPerWeek: formData.get("trainingDaysPerWeek"),
    equipmentAvailable: formData.get("equipmentAvailable"),
    sessionLength: formData.get("sessionLength"),
    nutritionGoal: formData.get("nutritionGoal"),
    dietaryPreference: formData.get("dietaryPreference"),
    currentWeight: formData.get("currentWeight"),
    targetWeight: formData.get("targetWeight"),
    height: formData.get("height"),
    age: formData.get("age")
  });

  await supabase.from("onboarding_answers").upsert({
    user_id: user.id,
    main_goal: parsed.mainGoal,
    experience_level: parsed.experienceLevel,
    training_days_per_week: parsed.trainingDaysPerWeek,
    equipment_available: parsed.equipmentAvailable,
    session_length: parsed.sessionLength,
    nutrition_goal: parsed.nutritionGoal,
    dietary_preference: parsed.dietaryPreference,
    current_weight: parsed.currentWeight,
    target_weight: parsed.targetWeight,
    height: parsed.height,
    age: parsed.age
  }, { onConflict: "user_id" });

  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    goal: parsed.mainGoal,
    experience: parsed.experienceLevel,
    equipment: parsed.equipmentAvailable
  });

  await supabase.from("weekly_training_plans").delete().eq("user_id", user.id);
  await supabase.from("nutrition_targets").delete().eq("user_id", user.id);

  const days = buildGeneratedPlan(parsed);
  const { data: weeklyPlan, error: weeklyError } = await supabase
    .from("weekly_training_plans")
    .insert({
      user_id: user.id,
      plan_name: `${parsed.mainGoal} starter plan`,
      goal: parsed.mainGoal,
      difficulty_level: parsed.experienceLevel,
      expected_outcome: `Build confidence, consistency, and measurable progress toward ${parsed.mainGoal.toLowerCase()}.`,
      weekly_structure: `${parsed.trainingDaysPerWeek} training days, ${7 - parsed.trainingDaysPerWeek} recovery days, ${parsed.sessionLength}-minute sessions.`
    })
    .select("id")
    .single();
  if (weeklyError || !weeklyPlan) throw new Error(weeklyError?.message ?? "Could not create weekly plan.");

  for (const day of days) {
    const { data: trainingDay, error: dayError } = await supabase
      .from("training_days")
      .insert({
        user_id: user.id,
        weekly_plan_id: weeklyPlan.id,
        day_of_week: day.day,
        day_index: day.dayIndex,
        training_focus: day.focus,
        is_rest_day: day.isRestDay,
        estimated_duration: day.estimatedDuration,
        why_it_exists: day.whyItExists,
        main_muscles: day.mainMuscles,
        recovery_notes: day.recoveryNotes
      })
      .select("id")
      .single();
    if (dayError || !trainingDay) throw new Error(dayError?.message ?? "Could not create training day.");
    if (day.exercises.length) {
      await supabase.from("planned_exercises").insert(day.exercises.map((exercise, index) => ({
        user_id: user.id,
        training_day_id: trainingDay.id,
        exercise_name: exercise.name,
        muscle_groups: exercise.muscleGroups,
        sets: exercise.sets,
        reps: exercise.reps,
        target_weight: exercise.targetWeight,
        rest_seconds: exercise.restSeconds,
        notes: exercise.notes,
        sort_order: index
      })));
    }
  }

  const nutrition = buildNutrition(parsed);
  const { data: target, error: targetError } = await supabase
    .from("nutrition_targets")
    .insert({
      user_id: user.id,
      goal: parsed.nutritionGoal,
      daily_calories: nutrition.dailyCalories,
      protein_target: nutrition.protein,
      carbs_target: nutrition.carbs,
      fat_target: nutrition.fat,
      water_target_liters: nutrition.water,
      explanation: nutrition.explanation
    })
    .select("id")
    .single();
  if (targetError || !target) throw new Error(targetError?.message ?? "Could not create nutrition target.");

  await supabase.from("meals").insert(nutrition.meals.map((meal, index) => ({
    user_id: user.id,
    nutrition_target_id: target.id,
    meal_name: meal.mealName,
    time_of_day: meal.timeOfDay,
    foods: meal.foods,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    purpose: meal.purpose,
    sort_order: index
  })));

  await supabase.from("body_weight_logs").insert({
    user_id: user.id,
    weight: parsed.currentWeight,
    notes: "Starting weight from onboarding"
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateProfileAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = profileSchema.parse({
    fullName: formData.get("fullName"),
    goal: formData.get("goal"),
    experience: formData.get("experience"),
    equipment: formData.get("equipment")
  });
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: parsed.fullName,
    goal: parsed.goal,
    experience: parsed.experience,
    equipment: parsed.equipment
  });
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

export async function createPlanFromTemplateAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const templateName = String(formData.get("templateName") ?? "");
  const template = planTemplates.find((plan) => plan.name === templateName);
  if (!template) throw new Error("Template not found.");

  await supabase.from("workout_plans").update({ is_active: false }).eq("user_id", user.id);
  const { data: plan, error } = await supabase
    .from("workout_plans")
    .insert({
      user_id: user.id,
      name: template.name,
      goal: template.goal,
      experience: template.experience,
      equipment: template.equipment,
      is_active: true
    })
    .select("id")
    .single();
  if (error || !plan) throw new Error(error?.message ?? "Could not create plan.");

  for (const [dayIndex, day] of template.days.entries()) {
    const { data: dayRow } = await supabase
      .from("workout_days")
      .insert({ user_id: user.id, plan_id: plan.id, day_name: day.dayName, sort_order: dayIndex })
      .select("id")
      .single();
    if (!dayRow) continue;
    await supabase.from("workout_exercises").insert(
      day.exercises.map(([exerciseName, sets, reps, restSeconds], index) => ({
        user_id: user.id,
        day_id: dayRow.id,
        exercise_name: exerciseName,
        sets,
        reps,
        rest_seconds: restSeconds,
        tempo: "controlled",
        notes: "",
        sort_order: index
      }))
    );
  }

  revalidatePath("/plan");
  revalidatePath("/dashboard");
  redirect("/plan");
}

export async function createBlankPlanAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = planSchema.parse({
    name: formData.get("name"),
    goal: formData.get("goal"),
    experience: formData.get("experience"),
    equipment: formData.get("equipment")
  });
  await supabase.from("workout_plans").update({ is_active: false }).eq("user_id", user.id);
  const { error } = await supabase.from("workout_plans").insert({
    user_id: user.id,
    name: parsed.name,
    goal: parsed.goal,
    experience: parsed.experience,
    equipment: parsed.equipment,
    is_active: true
  });
  if (error) throw new Error(error.message);
  revalidatePath("/plan");
  redirect("/plan");
}

export async function updatePlanAction(planId: string, formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = planSchema.parse({
    name: formData.get("name"),
    goal: formData.get("goal"),
    experience: formData.get("experience"),
    equipment: formData.get("equipment")
  });
  const { error } = await supabase
    .from("workout_plans")
    .update({
      name: parsed.name,
      goal: parsed.goal,
      experience: parsed.experience,
      equipment: parsed.equipment
    })
    .eq("id", planId)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/plan");
}

export async function deletePlanAction(planId: string) {
  const { supabase, user } = await currentUser();
  await supabase.from("workout_plans").delete().eq("id", planId).eq("user_id", user.id);
  revalidatePath("/plan");
  revalidatePath("/dashboard");
}

export async function addDayAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = daySchema.parse({ planId: formData.get("planId"), dayName: formData.get("dayName") });
  const { count } = await supabase
    .from("workout_plans")
    .select("*", { count: "exact", head: true })
    .eq("id", parsed.planId)
    .eq("user_id", user.id);
  if (!count) throw new Error("Plan not found.");
  await supabase.from("workout_days").insert({
    user_id: user.id,
    plan_id: parsed.planId,
    day_name: parsed.dayName,
    sort_order: Date.now()
  });
  revalidatePath("/plan");
}

export async function updateDayAction(dayId: string, formData: FormData) {
  const { supabase, user } = await currentUser();
  const dayName = daySchema.pick({ dayName: true }).parse({ dayName: formData.get("dayName") }).dayName;
  await supabase.from("workout_days").update({ day_name: dayName }).eq("id", dayId).eq("user_id", user.id);
  revalidatePath("/plan");
}

export async function addExerciseAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = exerciseSchema.parse({
    dayId: formData.get("dayId"),
    exerciseName: formData.get("exerciseName"),
    sets: formData.get("sets"),
    reps: formData.get("reps"),
    restSeconds: formData.get("restSeconds"),
    tempo: formData.get("tempo"),
    notes: formData.get("notes")
  });
  const { count } = await supabase
    .from("workout_days")
    .select("*", { count: "exact", head: true })
    .eq("id", parsed.dayId)
    .eq("user_id", user.id);
  if (!count) throw new Error("Workout day not found.");
  await supabase.from("workout_exercises").insert({
    user_id: user.id,
    day_id: parsed.dayId,
    exercise_name: parsed.exerciseName,
    sets: parsed.sets,
    reps: parsed.reps,
    rest_seconds: parsed.restSeconds,
    tempo: parsed.tempo,
    notes: parsed.notes,
    sort_order: Date.now()
  });
  revalidatePath("/plan");
}

export async function updateExerciseAction(exerciseId: string, formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = exerciseSchema.extend({ dayId: exerciseSchema.shape.dayId.optional() }).parse({
    exerciseName: formData.get("exerciseName"),
    sets: formData.get("sets"),
    reps: formData.get("reps"),
    restSeconds: formData.get("restSeconds"),
    tempo: formData.get("tempo"),
    notes: formData.get("notes")
  });
  await supabase
    .from("workout_exercises")
    .update({
      exercise_name: parsed.exerciseName,
      sets: parsed.sets,
      reps: parsed.reps,
      rest_seconds: parsed.restSeconds,
      tempo: parsed.tempo,
      notes: parsed.notes
    })
    .eq("id", exerciseId)
    .eq("user_id", user.id);
  revalidatePath("/plan");
}

export async function deleteExerciseAction(id: string) {
  const { supabase, user } = await currentUser();
  await supabase.from("workout_exercises").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/plan");
}

export async function completeWorkoutAction(planId: string, dayId: string) {
  const { supabase, user } = await currentUser();
  const { error } = await supabase.from("workout_logs").insert({
    user_id: user.id,
    plan_id: planId,
    day_id: dayId,
    completed_at: new Date().toISOString(),
    notes: "Completed from current plan"
  });
  if (error) throw new Error(error.message);
  revalidatePath("/plan");
  revalidatePath("/dashboard");
}

export async function startWorkoutAction(trainingDayId: string) {
  const { supabase, user } = await currentUser();
  const { data: day } = await supabase
    .from("training_days")
    .select("id, weekly_plan_id, training_focus")
    .eq("id", trainingDayId)
    .eq("user_id", user.id)
    .single();
  if (!day) throw new Error("Training day not found.");
  const { data: log, error } = await supabase
    .from("workout_logs")
    .insert({
      user_id: user.id,
      weekly_plan_id: day.weekly_plan_id,
      training_day_id: day.id,
      completed_at: new Date().toISOString(),
      notes: `Started ${day.training_focus}`
    })
    .select("id")
    .single();
  if (error || !log) throw new Error(error?.message ?? "Could not start workout.");
  redirect(`/track/${day.id}?log=${log.id}`);
}

export async function addWorkoutSetAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = trackingSetSchema.parse({
    workoutLogId: formData.get("workoutLogId"),
    exerciseName: formData.get("exerciseName"),
    setNumber: formData.get("setNumber"),
    weight: formData.get("weight"),
    reps: formData.get("reps"),
    restSeconds: formData.get("restSeconds"),
    rpe: formData.get("rpe"),
    notes: formData.get("notes"),
    isComplete: formData.get("isComplete") === "on"
  });
  const { count } = await supabase
    .from("workout_logs")
    .select("*", { count: "exact", head: true })
    .eq("id", parsed.workoutLogId)
    .eq("user_id", user.id);
  if (!count) throw new Error("Workout log not found.");
  await supabase.from("workout_sets").insert({
    user_id: user.id,
    workout_log_id: parsed.workoutLogId,
    exercise_name: parsed.exerciseName,
    set_number: parsed.setNumber,
    weight: parsed.weight,
    reps: parsed.reps,
    rest_seconds: parsed.restSeconds,
    rpe: parsed.rpe,
    notes: parsed.notes,
    is_complete: parsed.isComplete ?? true
  });
  revalidatePath("/track");
  revalidatePath("/progress");
}

export async function markWorkoutCompleteAction(logId: string, trainingDayId: string) {
  const { supabase, user } = await currentUser();
  await supabase
    .from("workout_logs")
    .update({ completed_at: new Date().toISOString(), notes: "Workout completed" })
    .eq("id", logId)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  redirect(`/track/${trainingDayId}?done=1`);
}

export async function updateTrainingDayAction(dayId: string, formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = trainingDaySchema.parse({
    trainingFocus: formData.get("trainingFocus"),
    estimatedDuration: formData.get("estimatedDuration"),
    whyItExists: formData.get("whyItExists"),
    recoveryNotes: formData.get("recoveryNotes")
  });
  await supabase.from("training_days").update({
    training_focus: parsed.trainingFocus,
    estimated_duration: parsed.estimatedDuration,
    why_it_exists: parsed.whyItExists,
    recovery_notes: parsed.recoveryNotes
  }).eq("id", dayId).eq("user_id", user.id);
  revalidatePath("/plan");
  revalidatePath("/dashboard");
}

export async function addPlannedExerciseAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = plannedExerciseSchema.parse({
    trainingDayId: formData.get("trainingDayId"),
    exerciseName: formData.get("exerciseName"),
    muscleGroups: formData.get("muscleGroups"),
    sets: formData.get("sets"),
    reps: formData.get("reps"),
    targetWeight: formData.get("targetWeight"),
    restSeconds: formData.get("restSeconds"),
    notes: formData.get("notes")
  });
  await supabase.from("planned_exercises").insert({
    user_id: user.id,
    training_day_id: parsed.trainingDayId,
    exercise_name: parsed.exerciseName,
    muscle_groups: parsed.muscleGroups.split(",").map((item) => item.trim()).filter(Boolean),
    sets: parsed.sets,
    reps: parsed.reps,
    target_weight: parsed.targetWeight,
    rest_seconds: parsed.restSeconds,
    notes: parsed.notes,
    sort_order: Date.now()
  });
  revalidatePath("/plan");
  revalidatePath("/dashboard");
}

export async function deletePlannedExerciseAction(exerciseId: string) {
  const { supabase, user } = await currentUser();
  await supabase.from("planned_exercises").delete().eq("id", exerciseId).eq("user_id", user.id);
  revalidatePath("/plan");
  revalidatePath("/dashboard");
}

export async function upsertNutritionAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = nutritionSchema.parse({
    goal: formData.get("goal"),
    dailyCalories: formData.get("dailyCalories"),
    proteinTarget: formData.get("proteinTarget"),
    carbsTarget: formData.get("carbsTarget"),
    fatTarget: formData.get("fatTarget"),
    mealsPerDay: formData.get("mealsPerDay"),
    waterTargetLiters: formData.get("waterTargetLiters"),
    notes: formData.get("notes")
  });
  await supabase.from("nutrition_plans").upsert({
    user_id: user.id,
    goal: parsed.goal,
    daily_calories: parsed.dailyCalories,
    protein_target: parsed.proteinTarget,
    carbs_target: parsed.carbsTarget,
    fat_target: parsed.fatTarget,
    meals_per_day: parsed.mealsPerDay,
    water_target_liters: parsed.waterTargetLiters,
    notes: parsed.notes
  }, { onConflict: "user_id" });
  revalidatePath("/nutrition");
  revalidatePath("/dashboard");
}

export async function addMealAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = mealSchema.parse({
    planId: formData.get("planId"),
    mealName: formData.get("mealName"),
    calories: formData.get("calories"),
    protein: formData.get("protein"),
    carbs: formData.get("carbs"),
    fat: formData.get("fat"),
    ingredients: formData.get("ingredients"),
    notes: formData.get("notes")
  });
  const { count } = await supabase
    .from("nutrition_plans")
    .select("*", { count: "exact", head: true })
    .eq("id", parsed.planId)
    .eq("user_id", user.id);
  if (!count) throw new Error("Nutrition plan not found.");
  await supabase.from("nutrition_meals").insert({
    user_id: user.id,
    plan_id: parsed.planId,
    meal_name: parsed.mealName,
    calories: parsed.calories,
    protein: parsed.protein,
    carbs: parsed.carbs,
    fat: parsed.fat,
    ingredients: parsed.ingredients,
    notes: parsed.notes,
    sort_order: Date.now()
  });
  revalidatePath("/nutrition");
}

export async function updateMealAction(mealId: string, formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = mealSchema.extend({ planId: mealSchema.shape.planId.optional() }).parse({
    mealName: formData.get("mealName"),
    calories: formData.get("calories"),
    protein: formData.get("protein"),
    carbs: formData.get("carbs"),
    fat: formData.get("fat"),
    ingredients: formData.get("ingredients"),
    notes: formData.get("notes")
  });
  await supabase
    .from("nutrition_meals")
    .update({
      meal_name: parsed.mealName,
      calories: parsed.calories,
      protein: parsed.protein,
      carbs: parsed.carbs,
      fat: parsed.fat,
      ingredients: parsed.ingredients,
      notes: parsed.notes
    })
    .eq("id", mealId)
    .eq("user_id", user.id);
  revalidatePath("/nutrition");
}

export async function moveMealAction(mealId: string, direction: "up" | "down") {
  const { supabase, user } = await currentUser();
  const { data: meal } = await supabase
    .from("nutrition_meals")
    .select("id, plan_id, sort_order")
    .eq("id", mealId)
    .eq("user_id", user.id)
    .single();
  if (!meal) return;
  const operator = direction === "up" ? "lt" : "gt";
  const orderAscending = direction !== "up";
  const { data: swap } = await supabase
    .from("nutrition_meals")
    .select("id, sort_order")
    .eq("plan_id", meal.plan_id)
    .eq("user_id", user.id)
    .filter("sort_order", operator, meal.sort_order)
    .order("sort_order", { ascending: orderAscending })
    .limit(1)
    .maybeSingle();
  if (!swap) return;
  await supabase.from("nutrition_meals").update({ sort_order: swap.sort_order }).eq("id", meal.id).eq("user_id", user.id);
  await supabase.from("nutrition_meals").update({ sort_order: meal.sort_order }).eq("id", swap.id).eq("user_id", user.id);
  revalidatePath("/nutrition");
}

export async function deleteMealAction(id: string) {
  const { supabase, user } = await currentUser();
  await supabase.from("nutrition_meals").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/nutrition");
}

export async function updateEasyMealAction(mealId: string, formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = easyMealSchema.extend({ nutritionTargetId: easyMealSchema.shape.nutritionTargetId.optional() }).parse({
    mealName: formData.get("mealName"),
    timeOfDay: formData.get("timeOfDay"),
    foods: formData.get("foods"),
    calories: formData.get("calories"),
    protein: formData.get("protein"),
    carbs: formData.get("carbs"),
    fat: formData.get("fat"),
    purpose: formData.get("purpose"),
    notes: formData.get("notes")
  });
  await supabase.from("meals").update({
    meal_name: parsed.mealName,
    time_of_day: parsed.timeOfDay,
    foods: parsed.foods,
    calories: parsed.calories,
    protein: parsed.protein,
    carbs: parsed.carbs,
    fat: parsed.fat,
    purpose: parsed.purpose,
    notes: parsed.notes
  }).eq("id", mealId).eq("user_id", user.id);
  revalidatePath("/nutrition");
}

export async function addEasyMealAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = easyMealSchema.parse({
    nutritionTargetId: formData.get("nutritionTargetId"),
    mealName: formData.get("mealName"),
    timeOfDay: formData.get("timeOfDay"),
    foods: formData.get("foods"),
    calories: formData.get("calories"),
    protein: formData.get("protein"),
    carbs: formData.get("carbs"),
    fat: formData.get("fat"),
    purpose: formData.get("purpose"),
    notes: formData.get("notes")
  });
  await supabase.from("meals").insert({
    user_id: user.id,
    nutrition_target_id: parsed.nutritionTargetId,
    meal_name: parsed.mealName,
    time_of_day: parsed.timeOfDay,
    foods: parsed.foods,
    calories: parsed.calories,
    protein: parsed.protein,
    carbs: parsed.carbs,
    fat: parsed.fat,
    purpose: parsed.purpose,
    notes: parsed.notes,
    sort_order: Date.now()
  });
  revalidatePath("/nutrition");
}

export async function deleteEasyMealAction(mealId: string) {
  const { supabase, user } = await currentUser();
  await supabase.from("meals").delete().eq("id", mealId).eq("user_id", user.id);
  revalidatePath("/nutrition");
}

export async function addBodyWeightAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = bodyWeightSchema.parse({
    weight: formData.get("weight"),
    notes: formData.get("notes")
  });
  await supabase.from("body_weight_logs").insert({
    user_id: user.id,
    weight: parsed.weight,
    notes: parsed.notes
  });
  revalidatePath("/progress");
}

export async function addMeasurementAction(formData: FormData) {
  const { supabase, user } = await currentUser();
  const parsed = measurementSchema.parse({
    chest: formData.get("chest") || undefined,
    waist: formData.get("waist") || undefined,
    hips: formData.get("hips") || undefined,
    arm: formData.get("arm") || undefined,
    thigh: formData.get("thigh") || undefined,
    notes: formData.get("notes")
  });
  await supabase.from("body_measurements").insert({
    user_id: user.id,
    chest: parsed.chest,
    waist: parsed.waist,
    hips: parsed.hips,
    arm: parsed.arm,
    thigh: parsed.thigh,
    notes: parsed.notes
  });
  revalidatePath("/progress");
}
