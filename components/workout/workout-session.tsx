"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Plus, Trash2 } from "lucide-react";
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

function durationLabel(startedAt: string, completedAt?: string | null) {
  const end = completedAt ? new Date(completedAt).getTime() : Date.now();
  const minutes = Math.max(1, Math.round((end - new Date(startedAt).getTime()) / 60000));
  return `${minutes} min`;
}

function volume(sets: SessionSet[]) {
  return sets.reduce((sum, set) => sum + (Number.parseFloat(set.weight || "0") || 0) * (set.reps ?? 0), 0);
}

export function WorkoutSessionTracker({ session, exercises, sets, previousSetsByExercise, defaultUnit }: Props) {
  const [index, setIndex] = useState(0);
  const [restRemaining, setRestRemaining] = useState(0);
  const [extraSets, setExtraSets] = useState(0);
  const [pendingSet, startSetTransition] = useTransition();
  const current = exercises[index];
  const todaySets = useMemo(() => sets.filter((set) => set.workout_session_exercise_id === current?.id), [sets, current?.id]);
  const previousSets = current ? previousSetsByExercise[current.exercise_name] ?? [] : [];
  const completedExercises = exercises.filter((exercise) => exercise.status === "completed").length;
  const progress = exercises.length ? Math.round((completedExercises / exercises.length) * 100) : 0;
  const setCount = Math.max(current?.planned_sets ?? 0, todaySets.length + 1, (current?.planned_sets ?? 0) + extraSets);

  useEffect(() => {
    if (!restRemaining) return;
    const timer = window.setInterval(() => setRestRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [restRemaining]);

  if (!current) {
    return (
      <Card>
        <p className="text-xl font-black">No exercises loaded</p>
        <p className="mt-2 text-sm text-slate-500">Add exercises to this training day, then start a new workout.</p>
      </Card>
    );
  }

  const saveSet = (formData: FormData) => {
    const rest = Number(formData.get("restSeconds") || current.rest_seconds || 60);
    startSetTransition(async () => {
      await addWorkoutSessionSetAction(formData);
      setRestRemaining(rest);
    });
  };

  return (
    <div className="grid gap-4">
      <Card className="border-emerald-300">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Start workout</p>
            <h1 className="mt-2 text-3xl font-black">{session.workout_name}</h1>
            <p className="mt-1 text-sm text-slate-500">{session.day_of_week} · Started {new Date(session.started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {durationLabel(session.started_at, session.completed_at)}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blood transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs font-bold text-slate-500">{completedExercises}/{exercises.length} exercises complete</p>
          </div>
          <RestTimer seconds={restRemaining} onSkip={() => setRestRemaining(0)} onAdd={() => setRestRemaining((value) => value + 30)} />
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2 sm:gap-3">
          <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-line hover:border-emerald-300" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0} aria-label="Previous exercise">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 text-center">
            <p className="text-sm font-bold text-slate-500">Exercise {index + 1} of {exercises.length}</p>
            <h2 className="mt-1 break-words text-2xl font-black sm:text-3xl">{current.exercise_name}</h2>
            <p className="mt-1 text-sm text-slate-500">{current.muscle_group || "Muscle group"} · Target {current.planned_sets} sets · {current.planned_reps || "target reps"} · {current.rest_seconds ?? 60}s rest</p>
          </div>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-line hover:border-emerald-300" onClick={() => setIndex((value) => Math.min(exercises.length - 1, value + 1))} disabled={index === exercises.length - 1} aria-label="Next exercise">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="text-2xl font-black">Track sets</h3>
        <p className="mt-1 text-sm text-slate-500">Previous performance appears beside each set so you know what to beat.</p>
        <div className="mt-5 grid gap-3">
          {Array.from({ length: setCount }, (_, itemIndex) => {
            const setNumber = itemIndex + 1;
            const saved = todaySets.find((set) => set.set_number === setNumber);
            const previous = previousSets.find((set) => set.set_number === setNumber);
            return (
              <div key={setNumber} className="rounded-lg border border-line bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black">Set {setNumber}</p>
                    <p className="text-sm text-slate-500">Previous: {previous ? `${previous.weight || "0"}${previous.weight_unit} x ${previous.reps ?? 0}` : "No previous set"}</p>
                    {saved ? <p className="mt-1 text-sm font-bold text-emerald-700">Saved: {saved.weight || "0"}{saved.weight_unit} x {saved.reps ?? 0}</p> : null}
                  </div>
                  {saved ? (
                    <button type="button" onClick={() => void removeWorkoutSessionSetAction(saved.id, session.id)} className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-emerald-300">
                      <Trash2 className="h-4 w-4" />Remove
                    </button>
                  ) : null}
                </div>
                {!saved ? (
                  <form action={saveSet} className="mt-3 grid gap-3 md:grid-cols-6">
                    <input type="hidden" name="workoutSessionId" value={session.id} />
                    <input type="hidden" name="workoutSessionExerciseId" value={current.id} />
                    <input type="hidden" name="exerciseName" value={current.exercise_name} />
                    <input type="hidden" name="setNumber" value={setNumber} />
                    <input name="weight" placeholder="Weight, e.g. 60" defaultValue={previous?.weight ?? ""} />
                    <select name="weightUnit" defaultValue={previous?.weight_unit ?? defaultUnit} aria-label="Weight unit">
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                    <input name="reps" type="number" placeholder="Reps, e.g. 10" defaultValue={previous?.reps ?? ""} required />
                    <input name="restSeconds" type="number" placeholder="Rest, e.g. 90" defaultValue={current.rest_seconds ?? 60} />
                    <input name="rpe" type="number" min="1" max="10" step="0.5" placeholder="RPE, e.g. 8" defaultValue="7" />
                    <input name="notes" placeholder="Set notes, e.g. Smooth reps" />
                    <Button disabled={pendingSet} className="md:col-span-6"><CheckCircle2 className="h-4 w-4" />{pendingSet ? "Saving..." : "Complete Set"}</Button>
                  </form>
                ) : null}
              </div>
            );
          })}
          <button type="button" onClick={() => setExtraSets((value) => value + 1)} className="inline-flex w-fit items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-emerald-300">
            <Plus className="h-4 w-4" />Add extra set
          </button>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={() => void updateSessionExerciseStatusAction(current.id, session.id, "completed")} className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-4 py-3 text-sm font-black hover:border-emerald-300">
          <CheckCircle2 className="h-4 w-4" />Mark exercise complete
        </button>
        <button type="button" onClick={() => void updateSessionExerciseStatusAction(current.id, session.id, "skipped")} className="rounded-md border border-line px-4 py-3 text-sm font-black hover:border-emerald-300">
          Skip exercise
        </button>
        <button type="button" onClick={() => setIndex((value) => Math.min(exercises.length - 1, value + 1))} className="rounded-md bg-blood px-4 py-3 text-sm font-black hover:bg-ember">
          Next exercise
        </button>
      </div>

      <Card>
        <h3 className="text-2xl font-black">Complete workout</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-line bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.16em] text-slate-500">Duration</p><p className="mt-2 font-black">{durationLabel(session.started_at, session.completed_at)}</p></div>
          <div className="rounded-lg border border-line bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.16em] text-slate-500">Exercises completed</p><p className="mt-2 font-black">{completedExercises}/{exercises.length}</p></div>
          <div className="rounded-lg border border-line bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total volume</p><p className="mt-2 font-black">{Math.round(volume(sets))}</p></div>
          <div className="rounded-lg border border-line bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.16em] text-slate-500">Set count</p><p className="mt-2 font-black">{sets.length}</p></div>
        </div>
        <form action={finishWorkoutSessionAction.bind(null, session.id)} className="mt-5 grid gap-3">
          <textarea name="notes" placeholder="Workout notes, e.g. Bench felt stronger than last week" />
          <Button>Complete Workout</Button>
        </form>
      </Card>
    </div>
  );
}

function RestTimer({ seconds, onSkip, onAdd }: { seconds: number; onSkip: () => void; onAdd: () => void }) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  return (
    <div className="rounded-lg border border-line bg-slate-50 p-4 text-center lg:min-w-52">
      <p className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500"><Clock className="h-4 w-4" />Rest timer</p>
      <p className="mt-2 text-3xl font-black">{minutes}:{remainingSeconds}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={onSkip} className="rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-emerald-300">Skip Rest</button>
        <button type="button" onClick={onAdd} className="rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-emerald-300">Add 30s</button>
      </div>
    </div>
  );
}
