import { Activity, Camera, LineChart, Scale } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, EmptyState, ProgressRing, StatCard } from "@/components/ui";
import { addBodyWeightAction, addMeasurementAction } from "@/lib/actions";
import { getGuidedData } from "@/lib/data";
import type { WorkoutSet } from "@/lib/types";

function numberFromWeight(weight: string | null) {
  const match = weight?.match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

export default async function ProgressPage() {
  const { weeklyPlan, logs, sessions, sets, weights, measurements } = await getGuidedData();
  const workoutDays = weeklyPlan?.training_days?.filter((day: { is_rest_day: boolean }) => !day.is_rest_day).length ?? 0;
  const completedThisWeek = Math.min(sessions.filter((session) => session.status === "completed").length || logs.length, workoutDays || sessions.length || logs.length);
  const consistency = workoutDays ? Math.min(100, Math.round((completedThisWeek / workoutDays) * 100)) : 0;
  const workoutSets = sets as WorkoutSet[];
  const totalVolume = workoutSets.reduce((sum, set) => sum + numberFromWeight(set.weight) * (set.reps ?? 0), 0);
  const prs = Object.values(workoutSets.reduce<Record<string, WorkoutSet>>((best, set) => {
    const current = best[set.exercise_name];
    if (!current || numberFromWeight(set.weight) > numberFromWeight(current.weight)) best[set.exercise_name] = set;
    return best;
  }, {})).slice(0, 6);

  return (
    <AppShell>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Progress</p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">Proof that training is working</h1>
      <p className="mt-3 max-w-2xl text-slate-500">Track workouts, volume, strength, consistency, body weight, and measurements in one simple place.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Workouts this week" value={`${completedThisWeek}`} icon="trophy" />
        <StatCard label="Total volume" value={`${Math.round(totalVolume)}kg`} icon="dumbbell" />
        <StatCard label="Tracked sets" value={`${workoutSets.length}`} icon="target" />
        <StatCard label="Body weight" value={weights[0]?.weight ? `${weights[0].weight}kg` : "Add log"} icon="salad" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card>
          <ProgressRing value={consistency} label="Weekly consistency" />
          <p className="mt-4 text-sm text-slate-500">A simple score based on completed workouts versus planned workout days this week.</p>
        </Card>
        <Card>
          <h2 className="text-2xl font-black">Workout history</h2>
          <div className="mt-4 grid gap-2">
            {sessions.length ? sessions.slice(0, 8).map((session) => (
              <div key={session.id} className="rounded-lg border border-line bg-slate-50 p-4">
                <p className="font-black"><Activity className="mr-2 inline h-4 w-4 text-emerald-600" />{session.workout_name}</p>
                <p className="mt-1 text-sm text-slate-500">{new Date(session.started_at).toLocaleString()} · {session.status}</p>
              </div>
            )) : logs.length ? logs.slice(0, 8).map((log) => (
              <div key={log.id} className="rounded-lg border border-line bg-slate-50 p-4">
                <p className="font-black"><Activity className="mr-2 inline h-4 w-4 text-emerald-600" />Workout tracked</p>
                <p className="mt-1 text-sm text-slate-500">{new Date(log.completed_at).toLocaleString()} · {log.notes}</p>
              </div>
            )) : <EmptyState title="No workout history yet" body="Start a workout from the dashboard and save sets to build your history." />}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black">Personal records</h2>
          <p className="mt-1 text-sm text-slate-500">Highest tracked weight per exercise.</p>
          <div className="mt-4 grid gap-2">
            {prs.length ? prs.map((set) => (
              <div key={set.id} className="flex items-center justify-between rounded-lg border border-line bg-slate-50 p-4">
                <span className="font-bold">{set.exercise_name}</span>
                <span className="text-emerald-600">{set.weight || "bodyweight"} x {set.reps}</span>
              </div>
            )) : <p className="text-sm text-slate-500">PRs appear after you track weighted sets.</p>}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black">Strength progression</h2>
          <p className="mt-1 text-sm text-slate-500">Recent set entries by exercise. Add more sets to see clearer trends.</p>
          <div className="mt-4 grid gap-2">
            {workoutSets.slice(0, 8).map((set) => (
              <div key={set.id} className="rounded-lg border border-line bg-slate-50 p-4">
                <p className="font-bold">{set.exercise_name}</p>
                <p className="text-sm text-slate-500">Set {set.set_number}: {set.weight || "bodyweight"} · {set.reps} reps · RPE {set.rpe}/10</p>
              </div>
            ))}
            {!workoutSets.length ? <p className="text-sm text-slate-500">No set data yet.</p> : null}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 text-2xl font-black"><LineChart className="h-5 w-5 text-emerald-600" />Strength graphs</h2>
          <p className="mt-1 text-sm text-slate-500">A quick visual read of your latest tracked strength work.</p>
          <div className="mt-5 grid gap-3">
            {prs.length ? prs.slice(0, 4).map((set) => {
              const value = Math.min(100, Math.max(12, numberFromWeight(set.weight)));
              return (
                <div key={set.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-bold">{set.exercise_name}</span>
                    <span className="text-slate-500">{set.weight || "bodyweight"} x {set.reps}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blood" style={{ width: `${value}%` }} />
                  </div>
                </div>
              );
            }) : <p className="text-sm text-slate-500">Graphs appear after you track sets in a workout.</p>}
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-2xl font-black"><Camera className="h-5 w-5 text-emerald-600" />Progress photos</h2>
          <p className="mt-1 text-sm text-slate-500">Keep photo check-ins consistent: same lighting, same pose, same time of day.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Front", "Side", "Back"].map((angle) => (
              <div key={angle} className="grid aspect-[3/4] place-items-center rounded-lg border border-dashed border-line bg-slate-50 text-center">
                <div>
                  <Camera className="mx-auto h-6 w-6 text-emerald-600" />
                  <p className="mt-3 text-sm font-black">{angle}</p>
                  <p className="mt-1 text-xs text-slate-500">Upload slot</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black">Body weight tracker</h2>
          <form action={addBodyWeightAction} className="mt-4 grid gap-3">
            <input name="weight" type="number" step="0.1" placeholder="Enter your current weight, e.g. 82kg" required />
            <textarea name="notes" placeholder="Write notes, e.g. Felt lighter after morning walk" />
            <Button><Scale className="h-4 w-4" />Add weight log</Button>
          </form>
          <div className="mt-4 grid gap-2">
            {weights.slice(0, 5).map((entry) => (
              <p key={entry.id} className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">{entry.weight}kg · {new Date(entry.logged_at).toLocaleDateString()} · {entry.notes}</p>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-black">Measurements tracker</h2>
          <form action={addMeasurementAction} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input name="chest" type="number" step="0.1" placeholder="Chest, e.g. 102cm" />
            <input name="waist" type="number" step="0.1" placeholder="Waist, e.g. 84cm" />
            <input name="hips" type="number" step="0.1" placeholder="Hips, e.g. 98cm" />
            <input name="arm" type="number" step="0.1" placeholder="Arm, e.g. 36cm" />
            <input name="thigh" type="number" step="0.1" placeholder="Thigh, e.g. 58cm" />
            <textarea name="notes" placeholder="Notes, e.g. Measured first thing in the morning" className="sm:col-span-2" />
            <Button className="sm:col-span-2">Add measurements</Button>
          </form>
          <div className="mt-4 grid gap-2">
            {measurements.slice(0, 5).map((entry) => (
              <p key={entry.id} className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">Waist {entry.waist ?? "-"}cm · Chest {entry.chest ?? "-"}cm · {new Date(entry.logged_at).toLocaleDateString()}</p>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
