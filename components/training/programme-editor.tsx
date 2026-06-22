"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Dumbbell, Edit3, Plus, Save, Trash2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { ExerciseAddForm } from "@/components/workout/exercise-add-form";
import {
  addTrainingDayAction,
  deletePlannedExerciseAction,
  movePlannedExerciseAction,
  updatePlannedExerciseAction,
  updateTrainingDayAction
} from "@/lib/actions";
import type { PlannedExercise, TrainingDay, WeeklyTrainingPlan } from "@/lib/types";
import type { WorkoutCategory } from "@/lib/exercise-catalog";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const categories = [
  ["push", "Push"],
  ["pull", "Pull"],
  ["legs", "Legs"],
  ["upper", "Upper Body"],
  ["lower", "Lower Body"],
  ["full_body", "Full Body"],
  ["cardio", "Cardio"],
  ["mobility", "Mobility"],
  ["core", "Core"]
];

export function ProgrammeEditor({ plan, days }: { plan: WeeklyTrainingPlan; days: TrainingDay[] }) {
  const sortedDays = useMemo(() => [...days].sort((a, b) => a.day_index - b.day_index), [days]);
  const [selectedDayId, setSelectedDayId] = useState(sortedDays.find((day) => !day.is_rest_day)?.id ?? sortedDays[0]?.id);
  const [editingDay, setEditingDay] = useState(false);
  const [addingExercise, setAddingExercise] = useState(false);
  const selectedDay = sortedDays.find((day) => day.id === selectedDayId) ?? sortedDays[0];

  if (!selectedDay) {
    return (
      <Card>
        <h2 className="text-2xl font-black">Create your first training day</h2>
        <AddDayForm planId={plan.id} />
      </Card>
    );
  }

  const exercises = [...(selectedDay.planned_exercises ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">My programme</p>
        <h2 className="mt-2 text-2xl font-black">{plan.plan_name}</h2>
        <p className="mt-2 text-sm text-slate-500">Select a day, then edit the workout. Generated plans are not locked.</p>
        <div className="mt-5 grid gap-2">
          {sortedDays.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => { setSelectedDayId(day.id); setEditingDay(false); setAddingExercise(false); }}
              className={`rounded-lg border p-3 text-left transition ${selectedDay.id === day.id ? "border-emerald-300 bg-emerald-50" : "border-line bg-slate-50 hover:border-emerald-300"}`}
            >
              <p className="font-black">{day.day_of_week}: {day.training_focus}</p>
              <p className="mt-1 text-xs text-slate-500">{day.is_rest_day ? "Rest day" : `${day.planned_exercises?.length ?? 0} exercises · ${day.estimated_duration} min`}</p>
            </button>
          ))}
        </div>
        <AddDayForm planId={plan.id} />
      </Card>

      <div className="grid gap-4">
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Edit workout</p>
              <h2 className="mt-2 text-3xl font-black">{selectedDay.day_of_week}: {selectedDay.training_focus}</h2>
              <p className="mt-2 text-sm text-slate-500">{selectedDay.is_rest_day ? "Rest/recovery day" : `${exercises.length} exercises · ${selectedDay.estimated_duration} minutes`}</p>
            </div>
            <button onClick={() => setEditingDay((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-bold hover:border-emerald-300">
              <Edit3 className="h-4 w-4" />Edit day
            </button>
          </div>
          {editingDay ? <DayEditForm day={selectedDay} /> : null}
        </Card>

        {!selectedDay.is_rest_day ? (
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-black">Exercises</h3>
                <p className="mt-1 text-sm text-slate-500">Edit one card at a time. Move exercises up or down to change workout order.</p>
              </div>
              <button onClick={() => setAddingExercise((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-md bg-blood px-4 py-2 text-sm font-black text-slate-950 hover:bg-ember">
                <Plus className="h-4 w-4" />Add Exercise
              </button>
            </div>
            {addingExercise ? <ExerciseAddForm trainingDayId={selectedDay.id} category={(selectedDay.workout_category ?? "full_body") as WorkoutCategory} /> : null}
            <div className="mt-5 grid gap-3">
              {exercises.length ? exercises.map((exercise, index) => (
                <ExerciseCard key={exercise.id} exercise={exercise} isFirst={index === 0} isLast={index === exercises.length - 1} />
              )) : (
                <p className="rounded-lg border border-dashed border-line bg-slate-50 p-5 text-sm text-slate-500">No exercises yet. Use Add Exercise to build this workout.</p>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <h3 className="text-2xl font-black">Recovery day</h3>
            <p className="mt-2 text-sm text-slate-500">{selectedDay.recovery_notes || "Keep this day light. Mobility, walking and sleep are the priority."}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function DayEditForm({ day }: { day: TrainingDay }) {
  return (
    <form action={updateTrainingDayAction.bind(null, day.id)} className="mt-5 grid gap-3 rounded-lg border border-line bg-slate-50 p-4 md:grid-cols-2">
      <select name="dayOfWeek" defaultValue={day.day_of_week}>{weekDays.map((weekDay) => <option key={weekDay}>{weekDay}</option>)}</select>
      <select name="isRestDay" defaultValue={String(day.is_rest_day)}>
        <option value="false">Training day</option>
        <option value="true">Rest day</option>
      </select>
      <select name="workoutCategory" defaultValue={day.workout_category ?? "full_body"}>
        {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <input name="estimatedDuration" type="number" defaultValue={day.estimated_duration} placeholder="Estimated duration, e.g. 45" />
      <input name="trainingFocus" defaultValue={day.training_focus} placeholder="Day name, e.g. Chest, Push, Legs" className="md:col-span-2" />
      <textarea name="whyItExists" defaultValue={day.why_it_exists} placeholder="Workout goal, e.g. Build chest strength and pressing volume." className="md:col-span-2" />
      <textarea name="recoveryNotes" defaultValue={day.recovery_notes ?? ""} placeholder="Recovery notes, e.g. Keep intensity easy today." className="md:col-span-2" />
      <Button className="md:col-span-2"><Save className="h-4 w-4" />Save Workout</Button>
    </form>
  );
}

function AddDayForm({ planId }: { planId: string }) {
  return (
    <details className="mt-5 rounded-lg border border-line bg-slate-50 p-3">
      <summary className="cursor-pointer text-sm font-black">Add training day</summary>
      <form action={addTrainingDayAction.bind(null, planId)} className="mt-3 grid gap-3">
        <select name="dayOfWeek" defaultValue="Monday">{weekDays.map((weekDay) => <option key={weekDay}>{weekDay}</option>)}</select>
        <input name="trainingFocus" placeholder="Day name, e.g. Chest, Back, Legs" required />
        <select name="isRestDay" defaultValue="false"><option value="false">Training day</option><option value="true">Rest day</option></select>
        <select name="workoutCategory" defaultValue="full_body">{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        <input name="estimatedDuration" type="number" defaultValue="45" placeholder="Estimated duration, e.g. 45" />
        <textarea name="whyItExists" placeholder="Workout goal, e.g. Build upper body strength." />
        <textarea name="recoveryNotes" placeholder="Recovery notes, e.g. Keep two reps in reserve." />
        <Button><Plus className="h-4 w-4" />Add day</Button>
      </form>
    </details>
  );
}

function ExerciseCard({ exercise, isFirst, isLast }: { exercise: PlannedExercise; isFirst: boolean; isLast: boolean }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  return (
    <div className="rounded-lg border border-line bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-lg font-black"><Dumbbell className="h-4 w-4 text-emerald-600" />{exercise.exercise_name}</p>
          <p className="mt-1 text-sm text-slate-500">{exercise.muscle_group || exercise.muscle_groups?.join(", ") || "Muscle group"} · {exercise.sets} sets · {exercise.reps} reps · {exercise.rest_seconds}s rest</p>
          {exercise.notes ? <p className="mt-2 text-sm text-slate-500">{exercise.notes}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button disabled={isFirst || pending} onClick={() => startTransition(() => void movePlannedExerciseAction(exercise.id, "up"))} className="rounded-md border border-line p-2 hover:border-emerald-300 disabled:opacity-40" aria-label="Move exercise up"><ArrowUp className="h-4 w-4" /></button>
          <button disabled={isLast || pending} onClick={() => startTransition(() => void movePlannedExerciseAction(exercise.id, "down"))} className="rounded-md border border-line p-2 hover:border-emerald-300 disabled:opacity-40" aria-label="Move exercise down"><ArrowDown className="h-4 w-4" /></button>
          <button onClick={() => setEditing((value) => !value)} className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-emerald-300"><Edit3 className="h-4 w-4" />Edit</button>
          <form action={deletePlannedExerciseAction.bind(null, exercise.id)}>
            <button className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-emerald-300"><Trash2 className="h-4 w-4" />Remove</button>
          </form>
        </div>
      </div>
      {editing ? (
        <form action={updatePlannedExerciseAction.bind(null, exercise.id)} className="mt-4 grid gap-3 border-t border-line pt-4 md:grid-cols-2">
          <input name="exerciseName" defaultValue={exercise.exercise_name} placeholder="Exercise name, e.g. Bench Press" required />
          <input name="muscleGroup" defaultValue={exercise.muscle_group || exercise.muscle_groups?.join(", ")} placeholder="Muscle group, e.g. Chest" />
          <input name="sets" type="number" defaultValue={exercise.sets} placeholder="Sets, e.g. 3" />
          <input name="reps" defaultValue={exercise.reps} placeholder="Target reps, e.g. 8-10" />
          <input name="restSeconds" type="number" defaultValue={exercise.rest_seconds} placeholder="Rest time, e.g. 90" />
          <input name="targetWeight" defaultValue={exercise.target_weight ?? ""} placeholder="Target weight, e.g. 60kg" />
          <input type="hidden" name="muscleGroups" value={exercise.muscle_groups?.join(", ") ?? ""} />
          <textarea name="notes" defaultValue={exercise.notes ?? ""} placeholder="Notes, e.g. Pause at the bottom." className="md:col-span-2" />
          <Button className="md:col-span-2"><Save className="h-4 w-4" />Save exercise</Button>
        </form>
      ) : null}
    </div>
  );
}
