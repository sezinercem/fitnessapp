import { Plus, Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, EmptyState } from "@/components/ui";
import { ConfirmButton } from "@/components/confirm-button";
import { addDayAction, addExerciseAction, completeWorkoutAction, createBlankPlanAction, createPlanFromTemplateAction, deleteExerciseAction, deletePlanAction, updateDayAction, updateExerciseAction, updatePlanAction } from "@/lib/actions";
import { getAuthedData } from "@/lib/data";
import { planTemplates } from "@/lib/sample-data";
import type { WorkoutDay } from "@/lib/types";

export default async function PlanPage() {
  const { plan } = await getAuthedData();
  const days = ((plan?.workout_days ?? []) as WorkoutDay[]).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <AppShell>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Current plan</p>
          <h1 className="mt-2 text-4xl font-black">Workout builder</h1>
        </div>
      </div>

      {!plan ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <h2 className="text-2xl font-black">Choose a template</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {planTemplates.map((template) => (
                <form key={template.name} action={createPlanFromTemplateAction} className="rounded-lg border border-line bg-black p-4">
                  <input type="hidden" name="templateName" value={template.name} />
                  <p className="font-black">{template.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{template.goal} · {template.experience} · {template.equipment}</p>
                  <Button className="mt-4 w-full"><Plus className="h-4 w-4" />Use plan</Button>
                </form>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Create from scratch</h2>
            <form action={createBlankPlanAction} className="mt-4 grid gap-3">
              <input name="name" placeholder="Plan name" required />
              <input name="goal" placeholder="Goal" required />
              <input name="experience" placeholder="Experience" required />
              <input name="equipment" placeholder="Equipment" required />
              <Button>Create plan</Button>
            </form>
          </Card>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <h2 className="text-2xl font-black">Plan details</h2>
            <form action={updatePlanAction.bind(null, plan.id)} className="mt-4 grid gap-3">
              <input name="name" defaultValue={plan.name} required />
              <input name="goal" defaultValue={plan.goal} required />
              <input name="experience" defaultValue={plan.experience} required />
              <input name="equipment" defaultValue={plan.equipment} required />
              <Button><Save className="h-4 w-4" />Save changes</Button>
            </form>
            <div className="mt-4">
              <ConfirmButton action={deletePlanAction.bind(null, plan.id)} label="Delete plan" />
            </div>
            <form action={addDayAction} className="mt-6 grid gap-3 border-t border-line pt-5">
              <input type="hidden" name="planId" value={plan.id} />
              <input name="dayName" placeholder="Add workout day" required />
              <Button><Plus className="h-4 w-4" />Add day</Button>
            </form>
          </Card>

          <div className="grid gap-4">
            {days.length ? days.map((day) => (
              <Card key={day.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <form action={updateDayAction.bind(null, day.id)} className="flex gap-2">
                      <input name="dayName" defaultValue={day.day_name} className="max-w-xs text-xl font-black" />
                      <button className="rounded-md border border-line px-3 text-sm font-bold hover:border-blood">Save</button>
                    </form>
                    <p className="text-sm text-zinc-400">{day.workout_exercises?.length ?? 0} exercises</p>
                  </div>
                  <form action={completeWorkoutAction.bind(null, plan.id, day.id)}>
                    <Button>Mark complete</Button>
                  </form>
                </div>
                <div className="mt-4 grid gap-3">
                  {(day.workout_exercises ?? []).sort((a, b) => a.sort_order - b.sort_order).map((exercise) => (
                    <div key={exercise.id} className="rounded-lg border border-line bg-black p-4">
                      <form action={updateExerciseAction.bind(null, exercise.id)} className="grid gap-3 md:grid-cols-6">
                        <input name="exerciseName" defaultValue={exercise.exercise_name} className="md:col-span-2" />
                        <input name="sets" type="number" min="1" defaultValue={exercise.sets} />
                        <input name="reps" defaultValue={exercise.reps} />
                        <input name="restSeconds" type="number" min="15" defaultValue={exercise.rest_seconds} />
                        <input name="tempo" defaultValue={exercise.tempo ?? ""} />
                        <textarea name="notes" defaultValue={exercise.notes ?? ""} placeholder="Notes" className="md:col-span-6" />
                        <div className="flex gap-2 md:col-span-6">
                          <Button><Save className="h-4 w-4" />Update exercise</Button>
                        </div>
                      </form>
                      <form action={deleteExerciseAction.bind(null, exercise.id)} className="mt-2">
                        <button className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold text-zinc-300 hover:border-blood">
                          <Trash2 className="h-4 w-4" />Remove
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
                <form action={addExerciseAction} className="mt-4 grid gap-3 rounded-lg border border-line bg-black p-4 md:grid-cols-2">
                  <input type="hidden" name="dayId" value={day.id} />
                  <input name="exerciseName" placeholder="Exercise name" required />
                  <input name="sets" type="number" min="1" defaultValue="3" />
                  <input name="reps" placeholder="Reps" defaultValue="10" />
                  <input name="restSeconds" type="number" min="15" defaultValue="60" />
                  <input name="tempo" placeholder="Tempo" defaultValue="controlled" />
                  <textarea name="notes" placeholder="Notes" className="md:col-span-2" />
                  <Button className="md:col-span-2"><Plus className="h-4 w-4" />Add exercise</Button>
                </form>
              </Card>
            )) : <EmptyState title="No workout days yet" body="Add your first day, then add exercises with sets, reps, rest, tempo, and notes." />}
          </div>
        </div>
      )}
    </AppShell>
  );
}
