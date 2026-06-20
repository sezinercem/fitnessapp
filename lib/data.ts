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
