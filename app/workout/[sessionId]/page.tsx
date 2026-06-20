import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { WorkoutSessionTracker } from "@/components/workout/workout-session";
import { createClient } from "@/lib/supabase/server";
import type { Profile, SessionSet, WorkoutSession, WorkoutSessionExercise } from "@/lib/types";

export default async function WorkoutSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: session }, { data: exercises }, { data: sets }, { data: profile }] = await Promise.all([
    supabase.from("workout_sessions").select("*").eq("id", sessionId).eq("user_id", user.id).single(),
    supabase.from("workout_session_exercises").select("*").eq("workout_session_id", sessionId).eq("user_id", user.id).order("exercise_order"),
    supabase.from("workout_sets").select("*").eq("workout_session_id", sessionId).eq("user_id", user.id).order("created_at"),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
  ]);

  if (!session) redirect("/dashboard");

  const sessionExercises = (exercises ?? []) as WorkoutSessionExercise[];
  const exerciseNames = sessionExercises.map((exercise) => exercise.exercise_name);
  const { data: previousSets } = exerciseNames.length
    ? await supabase
        .from("workout_sets")
        .select("*")
        .in("exercise_name", exerciseNames)
        .eq("user_id", user.id)
        .neq("workout_session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(120)
    : { data: [] };

  const previousSetsByExercise = ((previousSets ?? []) as SessionSet[]).reduce<Record<string, SessionSet[]>>((grouped, set) => {
    const current = grouped[set.exercise_name] ?? [];
    if (current.length < 5) grouped[set.exercise_name] = [...current, set];
    return grouped;
  }, {});

  return (
    <AppShell>
      <WorkoutSessionTracker
        session={session as WorkoutSession}
        exercises={sessionExercises}
        sets={(sets ?? []) as SessionSet[]}
        previousSetsByExercise={previousSetsByExercise}
        defaultUnit={((profile as Profile | null)?.default_weight_unit ?? "kg") as "kg" | "lb"}
      />
    </AppShell>
  );
}
