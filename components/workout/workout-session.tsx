"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import {
  addWorkoutSessionSetAction,
  finishWorkoutSessionAction,
  removeWorkoutSessionSetAction,
  updateSessionExerciseStatusAction
} from "@/lib/actions";
import { Button, Card } from "@/components/ui";
import type { SessionSet, WorkoutSession, WorkoutSessionExercise } from "@/lib/types";

type Props = {
  session: WorkoutSession;
  exercises: WorkoutSessionExercise[];
  sets: SessionSet[];
  previousSetsByExercise: Record<string, SessionSet[]>;
  defaultUnit: "kg" | "lb";
};

function volume(sets: SessionSet[]) {
  return sets.reduce((sum, set) => sum + (Number.parseFloat(set.weight || "0") || 0) * (set.reps ?? 0), 0);
}

function comparison(today: SessionSet[], previous: SessionSet[]) {
  const todayVolume = volume(today);
  const previousVolume = volume(previous);
  const todayTopWeight = Math.max(0, ...today.map((set) => Number.parseFloat(set.weight || "0") || 0));
  const previousTopWeight = Math.max(0, ...previous.map((set) => Number.parseFloat(set.weight || "0") || 0));
  const todayReps = today.reduce((sum, set) => sum + (set.reps ?? 0), 0);
  const previousReps = previous.reduce((sum, set) => sum + (set.reps ?? 0), 0);
  const items = [];
  if (today.length && previous.length) {
    if (todayTopWeight > previousTopWeight) items.push("Weight increased");
    if (todayTopWeight === previousTopWeight) items.push("Same weight");
    if (todayReps > previousReps) items.push("Reps increased");
    if (todayVolume > previousVolume) items.push("Total volume increased");
    if (todayTopWeight > previousTopWeight || todayVolume > previousVolume) items.push("New personal best");
  }
  return items.length ? items : ["Save sets to compare with your previous session"];
}

export function WorkoutSessionTracker({ session, exercises, sets, previousSetsByExercise, defaultUnit }: Props) {
  const [index, setIndex] = useState(0);
  const current = exercises[index];
  const todaySets = useMemo(() => sets.filter((set) => set.workout_session_exercise_id === current?.id), [sets, current?.id]);
  const previousSets = current ? previousSetsByExercise[current.exercise_name] ?? [] : [];
  const comparisons = comparison(todaySets, previousSets);
  const completed = exercises.filter((exercise) => exercise.status === "completed").length;
  const totalVolume = volume(sets);
  const started = new Date(session.started_at).getTime();
  const finished = session.completed_at ? new Date(session.completed_at).getTime() : started;
  const duration = Math.max(1, Math.round((finished - started) / 60000));

  if (!current) {
    return (
      <Card>
        <p className="text-xl font-black">No exercises loaded</p>
        <p className="mt-2 text-sm text-zinc-400">Add exercises to this training day, then start a new workout.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <Card className="border-blood/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Workout mode</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">{session.workout_name}</h1>
            <p className="mt-1 text-sm text-zinc-400">{session.day_of_week} · {completed}/{exercises.length} exercises complete · {duration} minutes</p>
          </div>
          <span className="rounded-md border border-line bg-black px-3 py-2 text-sm font-bold">Status: {session.status}</span>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2 sm:gap-3">
          <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-line hover:border-blood" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0} aria-label="Previous exercise">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 text-center">
            <p className="text-sm font-bold text-zinc-500">Current exercise {index + 1} of {exercises.length}</p>
            <h2 className="mt-1 break-words text-2xl font-black sm:text-3xl">{current.exercise_name}</h2>
            <p className="mt-1 text-sm text-zinc-400">Planned: {current.planned_sets} sets · {current.planned_reps || "target reps"}</p>
          </div>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-line hover:border-blood" onClick={() => setIndex((value) => Math.min(exercises.length - 1, value + 1))} disabled={index === exercises.length - 1} aria-label="Next exercise">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h3 className="text-xl font-black">Previous</h3>
          <p className="mt-1 text-sm text-zinc-400">Last saved performance for this same exercise.</p>
          <div className="mt-4 grid gap-2">
            {previousSets.length ? previousSets.map((set) => (
              <p key={set.id} className="rounded-md bg-black p-3 text-sm text-zinc-300">Set {set.set_number}: {set.weight || "0"}{set.weight_unit} x {set.reps ?? 0}</p>
            )) : <p className="rounded-md bg-black p-3 text-sm text-zinc-400">No previous performance yet.</p>}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-black">Today’s sets</h3>
          <div className="mt-4 grid gap-2">
            {todaySets.map((set) => (
              <div key={set.id} className="flex flex-col gap-2 rounded-md bg-black p-3 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
                <span>Set {set.set_number}: {set.weight || "0"}{set.weight_unit} x {set.reps ?? 0} · rest {set.rest_seconds ?? 0}s · RPE {set.rpe ?? "-"}</span>
                <button type="button" onClick={() => void removeWorkoutSessionSetAction(set.id, session.id)} className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 font-bold hover:border-blood">
                  <Trash2 className="h-4 w-4" />Remove set
                </button>
              </div>
            ))}
            {!todaySets.length ? <p className="rounded-md bg-black p-3 text-sm text-zinc-400">Add your first set below.</p> : null}
          </div>

          <form action={addWorkoutSessionSetAction} className="mt-4 grid gap-3 md:grid-cols-6">
            <input type="hidden" name="workoutSessionId" value={session.id} />
            <input type="hidden" name="workoutSessionExerciseId" value={current.id} />
            <input type="hidden" name="exerciseName" value={current.exercise_name} />
            <input name="setNumber" type="number" defaultValue={todaySets.length + 1} placeholder="Set, e.g. 1" />
            <input name="weight" placeholder="Weight, e.g. 40" />
            <select name="weightUnit" defaultValue={defaultUnit} aria-label="Weight unit">
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
            <input name="reps" type="number" placeholder="Reps, e.g. 10" />
            <input name="restSeconds" type="number" placeholder="Rest, e.g. 90 seconds" />
            <input name="rpe" type="number" min="1" max="10" step="0.5" placeholder="RPE, e.g. 8" />
            <textarea name="notes" placeholder="Notes, e.g. Felt stronger than last week" className="md:col-span-6" />
            <Button className="md:col-span-6"><Plus className="h-4 w-4" />Save set / add extra set</Button>
          </form>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-black">Progressive overload</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {comparisons.map((item) => (
            <span key={item} className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm font-bold text-red-100">{item}</span>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={() => void updateSessionExerciseStatusAction(current.id, session.id, "completed")} className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-4 py-3 text-sm font-black hover:border-blood">
          <CheckCircle2 className="h-4 w-4" />Mark exercise complete
        </button>
        <button type="button" onClick={() => void updateSessionExerciseStatusAction(current.id, session.id, "skipped")} className="rounded-md border border-line px-4 py-3 text-sm font-black hover:border-blood">
          Skip exercise
        </button>
        <button type="button" onClick={() => setIndex((value) => Math.min(exercises.length - 1, value + 1))} className="rounded-md bg-blood px-4 py-3 text-sm font-black hover:bg-ember">
          Save and continue
        </button>
      </div>

      <Card>
        <h3 className="text-2xl font-black">Workout summary</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-line bg-black p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Duration</p><p className="mt-2 font-black">{duration} min</p></div>
          <div className="rounded-lg border border-line bg-black p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Exercises completed</p><p className="mt-2 font-black">{completed}/{exercises.length}</p></div>
          <div className="rounded-lg border border-line bg-black p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Total volume</p><p className="mt-2 font-black">{Math.round(totalVolume)}</p></div>
          <div className="rounded-lg border border-line bg-black p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Set count</p><p className="mt-2 font-black">{sets.length}</p></div>
        </div>
        <form action={finishWorkoutSessionAction.bind(null, session.id)} className="mt-5 grid gap-3">
          <textarea name="notes" placeholder="Workout notes, e.g. Felt stronger than last week" />
          <Button>Finish Workout</Button>
        </form>
      </Card>
    </div>
  );
}
