import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAuthedData() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profile, plan, nutrition, logs] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("workout_plans")
      .select("*, workout_days(*, workout_exercises(*))")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .maybeSingle(),
    supabase
      .from("nutrition_plans")
      .select("*, nutrition_meals(*)")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("workout_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(10)
  ]);

  return {
    user,
    profile: profile.data,
    plan: plan.data,
    nutrition: nutrition.data,
    logs: logs.data ?? []
  };
}

export async function getGuidedData() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [onboarding, weeklyPlan, nutritionTarget, meals, logs, sessions, sets, weights, measurements] = await Promise.all([
    supabase.from("onboarding_answers").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("weekly_training_plans")
      .select("*, training_days(*, planned_exercises(*))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("nutrition_targets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("meals").select("*").eq("user_id", user.id).order("sort_order"),
    supabase.from("workout_logs").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(25),
    supabase.from("workout_sessions").select("*").eq("user_id", user.id).order("started_at", { ascending: false }).limit(25),
    supabase.from("workout_sets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(200),
    supabase.from("body_weight_logs").select("*").eq("user_id", user.id).order("logged_at", { ascending: false }).limit(20),
    supabase.from("body_measurements").select("*").eq("user_id", user.id).order("logged_at", { ascending: false }).limit(20)
  ]);

  return {
    user,
    onboarding: onboarding.data,
    weeklyPlan: weeklyPlan.data,
    nutritionTarget: nutritionTarget.data,
    easyMeals: meals.data ?? [],
    logs: logs.data ?? [],
    sessions: sessions.data ?? [],
    sets: sets.data ?? [],
    weights: weights.data ?? [],
    measurements: measurements.data ?? []
  };
}
