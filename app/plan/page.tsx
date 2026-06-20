import { Plus, Save, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, EmptyState } from "@/components/ui";
import { ConfirmButton } from "@/components/confirm-button";
import { ExerciseAddForm } from "@/components/workout/exercise-add-form";
import { addDayAction, addExerciseAction, completeWorkoutAction, createBlankPlanAction, createPlanFromTemplateAction, deleteExerciseAction, deletePlanAction, deletePlannedExerciseAction, regenerateWeeklyPlanAction, updateDayAction, updateExerciseAction, updatePlanAction, updateTrainingDayAction } from "@/lib/actions";
import { getAuthedData, getGuidedData } from "@/lib/data";
import { planTemplates } from "@/lib/sample-data";
import type { TrainingDay, WeeklyTrainingPlan, WorkoutDay } from "@/lib/types";
import type { WorkoutCategory } from "@/lib/exercise-catalog";

export default async function PlanPage() {
  const { plan } = await getAuthedData();
  const { weeklyPlan } = await getGuidedData();
  const days = ((plan?.workout_days ?? []) as WorkoutDay[]).sort((a, b) => a.sort_order - b.sort_order);
  const guidedPlan = weeklyPlan as WeeklyTrainingPlan | null;
  const guidedDays = ((guidedPlan?.training_days ?? []) as TrainingDay[]).sort((a, b) => a.day_index - b.day_index);
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <AppShell>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Current plan</p>
          <h1 className="mt-2 text-4xl font-black">Training plan</h1>
          <p className="mt-2 max-w-2xl text-zinc-400">Understand what each day is for, then edit the plan as your strength, time, or equipment changes.</p>
        </div>
      </div>

      {guidedPlan ? (
        <div className="mt-6 grid gap-4">
          <Card className="border-blood/30">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">What this plan gives you</p>
            <h2 className="mt-2 text-3xl font-black">{guidedPlan.plan_name}</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-line bg-black p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Goal</p><p className="mt-2 font-black">{guidedPlan.goal}</p></div>
              <div className="rounded-lg border border-line bg-black p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Weekly structure</p><p className="mt-2 font-black">{guidedPlan.weekly_structure}</p></div>
              <div className="rounded-lg border border-line bg-black p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Difficulty</p><p className="mt-2 font-black">{guidedPlan.difficulty_level}</p></div>
              <div className="rounded-lg border border-line bg-black p-4"><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Expected outcome</p><p className="mt-2 text-sm text-zinc-300">{guidedPlan.expected_outcome}</p></div>
            </div>
            <form action={regenerateWeeklyPlanAction} className="mt-5">
              <Button><Save className="h-4 w-4" />Regenerate from onboarding days</Button>
            </form>
          </Card>

          {guidedDays.map((day) => (
            <Card key={day.id}>
              <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <p className={`text-sm font-bold uppercase tracking-[0.18em] ${day.is_rest_day ? "text-zinc-500" : "text-ember"}`}>{day.day_of_week}</p>
                  <form action={updateTrainingDayAction.bind(null, day.id)} className="mt-3 grid gap-3">
                    <select name="dayOfWeek" defaultValue={day.day_of_week}>
                      {weekDays.map((weekDay) => <option key={weekDay}>{weekDay}</option>)}
                    </select>
                    <select name="isRestDay" defaultValue={String(day.is_rest_day)}>
                      <option value="false">Training day</option>
                      <option value="true">Rest/recovery day</option>
                    </select>
                    <select name="workoutCategory" defaultValue={day.workout_category ?? "full_body"}>
                      <option value="push">Push</option>
                      <option value="pull">Pull</option>
                      <option value="legs">Legs</option>
                      <option value="upper">Upper Body</option>
                      <option value="lower">Lower Body</option>
                      <option value="full_body">Full Body</option>
                      <option value="cardio">Cardio</option>
                      <option value="mobility">Mobility</option>
                      <option value="core">Core</option>
                    </select>
                    <input name="trainingFocus" defaultValue={day.training_focus} placeholder="Training focus, e.g. Lower Body Strength" />
                    <input name="estimatedDuration" type="number" defaultValue={day.estimated_duration} placeholder="Estimated duration, e.g. 45" />
                    <textarea name="whyItExists" defaultValue={day.why_it_exists} placeholder="Explain why this day exists, e.g. Builds stronger legs and glutes." />
                    <textarea name="recoveryNotes" defaultValue={day.recovery_notes ?? ""} placeholder="Recovery notes, e.g. Keep two reps in reserve." />
                    <Button><Save className="h-4 w-4" />Save day / move workout</Button>
                  </form>
                  <div className="mt-4 rounded-lg border border-line bg-black p-4">
                    <p className="font-black">Main muscles trained</p>
                    <p className="mt-1 text-sm text-zinc-400">{day.main_muscles?.join(", ") || "Add muscles in the notes"}</p>
                    <p className="mt-3 text-sm text-zinc-400">{day.is_rest_day ? "Rest day" : "Workout day"} · {day.estimated_duration} minutes</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black">Exercises</h3>
                  <div className="mt-3 grid gap-3">
                    {(day.planned_exercises ?? []).sort((a, b) => a.sort_order - b.sort_order).map((exercise) => (
                      <div key={exercise.id} className="rounded-lg border border-line bg-black p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-black">{exercise.exercise_name}</p>
                            <p className="mt-1 text-sm text-zinc-400">{exercise.sets} sets · {exercise.reps} reps · rest {exercise.rest_seconds}s · {exercise.target_weight}</p>
                            <p className="mt-1 text-sm text-zinc-500">{exercise.notes}</p>
                          </div>
                          <form action={deletePlannedExerciseAction.bind(null, exercise.id)}>
                            <button className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-blood"><Trash2 className="h-4 w-4" />Remove</button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                  {!day.is_rest_day ? <ExerciseAddForm trainingDayId={day.id} category={(day.workout_category ?? "full_body") as WorkoutCategory} /> : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

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
