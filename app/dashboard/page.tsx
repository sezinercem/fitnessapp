import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, Award, CalendarDays, Dumbbell, Flame, LineChart, Play, Salad, Scale } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, EmptyState, LinkButton, ProgressRing, StatCard } from "@/components/ui";
import { startWorkoutAction } from "@/lib/actions";
import { getGuidedData } from "@/lib/data";
import type { MealLog, TrainingDay, WeeklyTrainingPlan } from "@/lib/types";

function sumMeals(mealLogs: MealLog[]) {
  return mealLogs.flatMap((meal) => meal.meal_log_items ?? []).reduce(
    (sum, item) => ({
      calories: sum.calories + Number(item.total_calories ?? 0),
      protein: sum.protein + Number(item.total_protein ?? 0)
    }),
    { calories: 0, protein: 0 }
  );
}

export default async function DashboardPage() {
  const { onboarding, weeklyPlan, nutritionTarget, logs, sessions, weights, mealLogs } = await getGuidedData();
  if (!onboarding) redirect("/onboarding");

  const plan = weeklyPlan as WeeklyTrainingPlan | null;
  const days = ((plan?.training_days ?? []) as TrainingDay[]).sort((a, b) => a.day_index - b.day_index);
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const today = days.find((day) => day.day_index === todayIndex) ?? days[0];
  const upcoming = days.find((day) => day.day_index > todayIndex && !day.is_rest_day) ?? days.find((day) => !day.is_rest_day);
  const completedDayIds = new Set(sessions.filter((session) => session.status === "completed").map((session) => session.training_day_id).filter(Boolean));
  const completedThisWeek = days.filter((day) => completedDayIds.has(day.id)).length;
  const workoutDays = days.filter((day) => !day.is_rest_day).length;
  const consistency = workoutDays ? Math.round((completedThisWeek / workoutDays) * 100) : 0;
  const nutrition = sumMeals((mealLogs ?? []) as MealLog[]);
  const latestWeight = weights[0]?.weight ? Number(weights[0].weight) : null;
  const previousWeight = weights[1]?.weight ? Number(weights[1].weight) : null;
  const weightDelta = latestWeight !== null && previousWeight !== null ? Number((latestWeight - previousWeight).toFixed(1)) : null;
  const streak = sessions.filter((session) => session.status === "completed").length;

  return (
    <AppShell>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Coach dashboard</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">What needs doing today?</h1>
          <p className="mt-2 max-w-2xl text-slate-500">Your workout, nutrition and progress signals are here first. Start today’s session in one click.</p>
        </div>
        <LinkButton href="/training">Open training</LinkButton>
      </div>

      {today ? (
        <Card className="mt-6 border-emerald-300 bg-gradient-to-br from-white to-emerald-50">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Today’s workout</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">{today.is_rest_day ? "Recovery day" : today.training_focus}</h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                {today.is_rest_day ? "No strength workout today. Walk, mobilise and recover so the next session is better." : today.why_it_exists}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">{today.estimated_duration} min</span>
                <span className="rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">{today.planned_exercises?.length ?? 0} exercises</span>
                <span className="rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">{today.is_rest_day ? "Recovery" : "Training"}</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-56 lg:grid-cols-1">
              {!today.is_rest_day ? (
                <form action={startWorkoutAction.bind(null, today.id)}>
                  <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blood px-5 py-3 text-sm font-black text-slate-950 hover:bg-ember">
                    <Play className="h-4 w-4" />Start workout
                  </button>
                </form>
              ) : (
                <Link href="/training" className="inline-flex items-center justify-center gap-2 rounded-md bg-blood px-5 py-3 text-sm font-black text-slate-950 hover:bg-ember">
                  <Activity className="h-4 w-4" />View recovery
                </Link>
              )}
              <Link href="/training" className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-5 py-3 text-sm font-black text-slate-700 hover:border-emerald-300">
                Edit programme
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <EmptyState title="Finish onboarding" body="Answer a few questions so Apex can generate your first weekly plan." action={<LinkButton href="/onboarding">Start onboarding</LinkButton>} />
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current streak" value={`${streak} workouts`} icon="flame" />
        <StatCard label="Weight progress" value={latestWeight === null ? "Log weight" : `${latestWeight}kg${weightDelta !== null ? ` (${weightDelta > 0 ? "+" : ""}${weightDelta})` : ""}`} icon="target" />
        <StatCard label="Calories today" value={`${Math.round(nutrition.calories)} / ${nutritionTarget?.daily_calories ?? 0}`} icon="salad" />
        <StatCard label="Protein today" value={`${Math.round(nutrition.protein)}g / ${nutritionTarget?.protein_target ?? 0}g`} icon="dumbbell" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">This week</h2>
              <p className="mt-1 text-sm text-slate-500">A simplified programme view. Open Training for full editing, exercise swaps and builder tools.</p>
            </div>
            <Link href="/training" className="text-sm font-bold text-emerald-700 hover:text-slate-950">Manage training</Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
            {days.map((day) => {
              const isComplete = completedDayIds.has(day.id);
              return (
                <div key={day.id} className={`flex min-h-44 flex-col rounded-lg border p-4 ${day.is_rest_day ? "border-line bg-slate-50" : "border-emerald-300 bg-white"}`}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{day.day_of_week}</p>
                  <h3 className="mt-2 text-lg font-black">{day.training_focus}</h3>
                  <p className="mt-2 text-sm text-slate-500">{day.is_rest_day ? "Recovery" : `${day.planned_exercises?.length ?? 0} exercises`}</p>
                  <span className={`mt-3 inline-flex w-fit rounded-md px-2 py-1 text-xs font-bold ${isComplete ? "bg-emerald-100 text-emerald-800" : day.is_rest_day ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-800"}`}>
                    {isComplete ? "Complete" : day.is_rest_day ? "Rest" : "Ready"}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <ProgressRing value={consistency} label="Weekly consistency" />
            <p className="mt-4 text-sm text-slate-500">Complete scheduled workouts to build momentum. Rest days are part of the plan.</p>
          </Card>
          <Card>
            <h2 className="flex items-center gap-2 text-xl font-black"><CalendarDays className="h-5 w-5 text-emerald-600" />Upcoming training day</h2>
            <p className="mt-3 font-black">{upcoming ? `${upcoming.day_of_week}: ${upcoming.training_focus}` : "No workout scheduled"}</p>
            <p className="mt-1 text-sm text-slate-500">{upcoming ? `${upcoming.planned_exercises?.length ?? 0} exercises · ${upcoming.estimated_duration} minutes` : "Edit your programme to add training days."}</p>
          </Card>
          <Card>
            <h2 className="flex items-center gap-2 text-xl font-black"><Award className="h-5 w-5 text-emerald-600" />Recent achievements</h2>
            <div className="mt-4 space-y-2">
              {sessions.length ? sessions.slice(0, 3).map((session) => (
                <p key={session.id} className="rounded-md bg-slate-50 p-3 text-sm text-slate-600"><Flame className="mr-2 inline h-4 w-4 text-emerald-600" />{session.workout_name} · {session.status}</p>
              )) : logs.length ? logs.slice(0, 3).map((log) => (
                <p key={log.id} className="rounded-md bg-slate-50 p-3 text-sm text-slate-600"><LineChart className="mr-2 inline h-4 w-4 text-emerald-600" />Workout tracked · {new Date(log.completed_at).toLocaleDateString()}</p>
              )) : <p className="text-sm text-slate-500">No achievements yet. Start today’s workout to create the first one.</p>}
            </div>
          </Card>
          <div className="grid gap-2">
            <Link className="rounded-md border border-line bg-white px-3 py-3 text-sm font-bold hover:border-emerald-300" href="/nutrition"><Salad className="mr-2 inline h-4 w-4 text-emerald-600" />Log food</Link>
            <Link className="rounded-md border border-line bg-white px-3 py-3 text-sm font-bold hover:border-emerald-300" href="/progress"><Scale className="mr-2 inline h-4 w-4 text-emerald-600" />Log weight</Link>
            <Link className="rounded-md border border-line bg-white px-3 py-3 text-sm font-bold hover:border-emerald-300" href="/training"><Dumbbell className="mr-2 inline h-4 w-4 text-emerald-600" />Edit programme</Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
