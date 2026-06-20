import { redirect } from "next/navigation";
import { CheckCircle2, Plus, Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, EmptyState } from "@/components/ui";
import { addWorkoutSetAction, markWorkoutCompleteAction, startWorkoutAction } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import type { PlannedExercise, TrainingDay, WorkoutSet } from "@/lib/types";

export default async function TrackWorkoutPage({
  params,
  searchParams
}: {
  params: Promise<{ dayId: string }>;
  searchParams: Promise<{ log?: string; done?: string }>;
}) {
  const { dayId } = await params;
  const { log: logId, done } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: day } = await supabase
    .from("training_days")
    .select("*, planned_exercises(*)")
    .eq("id", dayId)
    .eq("user_id", user.id)
    .single();
  if (!day) redirect("/dashboard");

  const trainingDay = day as TrainingDay;
  const exercises = ((trainingDay.planned_exercises ?? []) as PlannedExercise[]).sort((a, b) => a.sort_order - b.sort_order);
  const { data: latestLog } = logId
    ? await supabase.from("workout_logs").select("*").eq("id", logId).eq("user_id", user.id).single()
    : { data: null };
  const activeLogId = latestLog?.id as string | undefined;
  const { data: sets } = activeLogId
    ? await supabase.from("workout_sets").select("*").eq("workout_log_id", activeLogId).eq("user_id", user.id).order("created_at")
    : { data: [] };
  const trackedSets = (sets ?? []) as WorkoutSet[];

  return (
    <AppShell>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Workout tracking</p>
      <h1 className="mt-2 text-4xl font-black">{trainingDay.day_of_week}: {trainingDay.training_focus}</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">{trainingDay.why_it_exists}</p>

      {done ? (
        <Card className="mt-6 border-emerald-500/40 bg-emerald-500/10">
          <p className="font-black text-emerald-200"><CheckCircle2 className="mr-2 inline h-5 w-5" />Workout complete. Great work.</p>
        </Card>
      ) : null}

      {!activeLogId ? (
        <Card className="mt-6">
          <h2 className="text-2xl font-black">Ready to start?</h2>
          <p className="mt-2 text-sm text-zinc-400">Start a workout log first. Then track sets, weights, reps, rest time, notes, and RPE for every exercise.</p>
          <form action={startWorkoutAction.bind(null, trainingDay.id)} className="mt-5">
            <Button><Plus className="h-4 w-4" />Start workout</Button>
          </form>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-4">
        {exercises.length ? exercises.map((exercise) => {
          const exerciseSets = trackedSets.filter((set) => set.exercise_name === exercise.exercise_name);
          return (
            <Card key={exercise.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">{exercise.exercise_name}</h2>
                  <p className="mt-1 text-sm text-zinc-400">{exercise.sets} planned sets · {exercise.reps} reps · {exercise.target_weight ?? "choose weight"} · rest {exercise.rest_seconds}s</p>
                  <p className="mt-2 text-sm text-zinc-500">{exercise.notes}</p>
                </div>
                <span className={`w-fit rounded-md px-3 py-2 text-sm font-bold ${exerciseSets.length >= exercise.sets ? "bg-emerald-500/15 text-emerald-300" : "bg-blood/15 text-red-100"}`}>
                  {exerciseSets.length >= exercise.sets ? "Exercise complete" : `${exerciseSets.length}/${exercise.sets} sets`}
                </span>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-zinc-500">
                    <tr>
                      <th className="pb-2">Set</th>
                      <th className="pb-2">Weight</th>
                      <th className="pb-2">Reps</th>
                      <th className="pb-2">Rest</th>
                      <th className="pb-2">RPE</th>
                      <th className="pb-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exerciseSets.map((set) => (
                      <tr key={set.id} className="border-t border-line">
                        <td className="py-3 font-bold">Set {set.set_number}</td>
                        <td>{set.weight || "-"}</td>
                        <td>{set.reps ?? "-"}</td>
                        <td>{set.rest_seconds ?? "-"}s</td>
                        <td>{set.rpe ?? "-"}/10</td>
                        <td className="text-zinc-400">{set.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {activeLogId ? (
                <form action={addWorkoutSetAction} className="mt-5 grid gap-3 rounded-lg border border-line bg-black p-4 md:grid-cols-6">
                  <input type="hidden" name="workoutLogId" value={activeLogId} />
                  <input type="hidden" name="exerciseName" value={exercise.exercise_name} />
                  <input name="setNumber" type="number" defaultValue={exerciseSets.length + 1} placeholder="Set number, e.g. 1" />
                  <input name="weight" placeholder="Add weight, e.g. 40kg" />
                  <input name="reps" type="number" placeholder="Add reps, e.g. 10" />
                  <input name="restSeconds" type="number" defaultValue={exercise.rest_seconds} placeholder="Track rest time, e.g. 60" />
                  <input name="rpe" type="number" min="1" max="10" step="0.5" placeholder="RPE, e.g. 8" />
                  <label className="flex items-center gap-2 rounded-md border border-line px-3 text-sm font-bold text-zinc-300"><input className="w-auto" name="isComplete" type="checkbox" defaultChecked />Complete</label>
                  <textarea name="notes" placeholder="How did this set feel? What did you struggle with today?" className="md:col-span-6" />
                  <Button className="md:col-span-6"><Save className="h-4 w-4" />Save set</Button>
                </form>
              ) : null}
            </Card>
          );
        }) : (
          <EmptyState title="No exercises yet" body="Add exercises to this day from the training plan page before tracking." />
        )}
      </div>

      {activeLogId ? (
        <form action={markWorkoutCompleteAction.bind(null, activeLogId, trainingDay.id)} className="mt-6">
          <Button className="w-full py-4"><CheckCircle2 className="h-5 w-5" />Mark whole workout complete</Button>
        </form>
      ) : null}
    </AppShell>
  );
}
