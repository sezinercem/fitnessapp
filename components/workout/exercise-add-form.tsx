"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { addPlannedExerciseAction } from "@/lib/actions";
import { categoryLabels, exerciseCatalog, isExerciseCompatible, type WorkoutCategory } from "@/lib/exercise-catalog";

export function ExerciseAddForm({ trainingDayId, category }: { trainingDayId: string; category: WorkoutCategory }) {
  const recommended = useMemo(() => exerciseCatalog.filter((exercise) => isExerciseCompatible(exercise.name, category)).slice(0, 8), [category]);
  const [exerciseName, setExerciseName] = useState(recommended[0]?.name ?? "");
  const mismatch = exerciseName.length > 1 && !isExerciseCompatible(exerciseName, category);

  return (
    <form action={addPlannedExerciseAction} className="mt-4 grid gap-3 rounded-lg border border-line bg-slate-50 p-4 md:grid-cols-2">
      <input type="hidden" name="trainingDayId" value={trainingDayId} />
      <label className="space-y-2 text-sm font-bold text-slate-600">
        Exercise
        <input
          name="exerciseName"
          list={`exercise-options-${trainingDayId}`}
          value={exerciseName}
          onChange={(event) => setExerciseName(event.target.value)}
          placeholder={`Add ${categoryLabels[category]} exercise, e.g. ${recommended[0]?.name ?? "Dumbbell Bench Press"}`}
          required
        />
        <datalist id={`exercise-options-${trainingDayId}`}>
          {recommended.map((exercise) => <option key={exercise.name} value={exercise.name} />)}
          {exerciseCatalog.map((exercise) => <option key={`all-${exercise.name}`} value={exercise.name} />)}
        </datalist>
      </label>
      <input name="muscleGroups" placeholder="Main muscles, e.g. Chest, shoulders, triceps" defaultValue={recommended.find((exercise) => exercise.name === exerciseName)?.primary_muscle_group ?? ""} />
      <input name="sets" type="number" defaultValue="3" placeholder="Sets, e.g. 3" />
      <input name="reps" placeholder="Add reps, e.g. 10" defaultValue="10" />
      <input name="targetWeight" placeholder="Add weight, e.g. 40kg" />
      <input name="restSeconds" type="number" defaultValue="60" placeholder="Rest time, e.g. 60" />
      {mismatch ? (
        <label className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-bold text-amber-100 md:col-span-2">
          <input className="mr-2 inline w-auto" type="checkbox" name="confirmMismatch" />
          {exerciseName} is usually not a {categoryLabels[category]} exercise. Are you sure you want to add it?
        </label>
      ) : null}
      <textarea name="notes" placeholder="Write notes, e.g. Felt strong today" className="md:col-span-2" />
      <Button className="md:col-span-2"><Plus className="h-4 w-4" />Add exercise</Button>
    </form>
  );
}
