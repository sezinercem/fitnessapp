import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarCheck, Dumbbell, Flame, Pencil, Play, Salad } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, EmptyState, LinkButton, ProgressRing, StatCard } from "@/components/ui";
import { startWorkoutAction } from "@/lib/actions";
import { getGuidedData } from "@/lib/data";
import type { TrainingDay, WeeklyTrainingPlan } from "@/lib/types";

export default async function DashboardPage() {
  const { onboarding, weeklyPlan, nutritionTarget, logs, sessions } = await getGuidedData();
  if (!onboarding) redirect("/onboarding");

  const plan = weeklyPlan as WeeklyTrainingPlan | null;
  const days = ((plan?.training_days ?? []) as TrainingDay[]).sort((a, b) => a.day_index - b.day_index);
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const today = days.find((day) => day.day_index === todayIndex) ?? days[0];
  const completedDayIds = new Set(sessions.filter((session) => session.status === "completed").map((session) => session.training_day_id).filter(Boolean));
  const completedThisWeek = days.filter((day) => completedDayIds.has(day.id)).length;
  const workoutDays = days.filter((day) => !day.is_rest_day).length;
  const consistency = workoutDays ? Math.round((completedThisWeek / workoutDays) * 100) : 0;

  return (
    <AppShell>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Command centre</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Your next best step</h1>
          <p className="mt-2 max-w-2xl text-zinc-400">Start with today. The rest of the week is laid out below so you always know what to train, track, or recover from.</p>
        </div>
        <LinkButton href="/progress">View progress</LinkButton>
      </div>

      {today ? (
        <Card className="mt-6 border-blood/40 bg-gradient-to-br from-panel to-black">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Today’s Training</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">{today.is_rest_day ? "Rest Day" : today.training_focus}</h2>
              <p className="mt-3 max-w-2xl text-zinc-400">
                {today.is_rest_day ? "Recovery, walking and mobility recommended." : today.why_it_exists}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-md border border-line bg-black px-3 py-2 text-sm font-bold">{today.is_rest_day ? "Rest day" : "Workout day"}</span>
                <span className="rounded-md border border-line bg-black px-3 py-2 text-sm font-bold">{today.estimated_duration} min</span>
                <span className="rounded-md border border-line bg-black px-3 py-2 text-sm font-bold">{today.planned_exercises?.length ?? 0} exercises</span>
              </div>
              {today.is_rest_day ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-line bg-black p-4"><p className="font-black">Mobility</p><p className="mt-1 text-sm text-zinc-400">10 minutes hips, hamstrings and upper back</p></div>
                  <div className="rounded-lg border border-line bg-black p-4"><p className="font-black">Walking target</p><p className="mt-1 text-sm text-zinc-400">7,000-10,000 easy steps</p></div>
                  <div className="rounded-lg border border-line bg-black p-4"><p className="font-black">Recovery tips</p><p className="mt-1 text-sm text-zinc-400">Hydrate, sleep well, keep stress low</p></div>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              {!today.is_rest_day ? (
                <form action={startWorkoutAction.bind(null, today.id)}>
                  <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blood px-5 py-3 text-sm font-black text-white hover:bg-ember">
                    <Play className="h-4 w-4" />Start Workout
                  </button>
                </form>
              ) : null}
              <Link href="/plan" className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-5 py-3 text-sm font-black text-zinc-200 hover:border-blood">
                <Pencil className="h-4 w-4" />{today.is_rest_day ? "View Recovery Plan" : "Edit today’s plan"}
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <EmptyState title="Finish onboarding" body="Answer a few questions so Apex can generate your first weekly plan." action={<LinkButton href="/onboarding">Start onboarding</LinkButton>} />
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Goal" value={plan?.goal ?? onboarding.main_goal} icon="target" />
        <StatCard label="Training days" value={`${workoutDays || onboarding.selected_training_days?.length || onboarding.training_days_per_week}/week`} icon="dumbbell" />
        <StatCard label="Calories" value={nutritionTarget ? `${nutritionTarget.daily_calories}` : "Set target"} icon="salad" />
        <StatCard label="Completed" value={`${completedThisWeek} this week`} icon="trophy" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Weekly plan</h2>
              <p className="mt-1 text-sm text-zinc-400">Each day shows whether to train or recover, what the focus is, and where to track it.</p>
            </div>
            <Link href="/plan" className="text-sm font-bold text-ember hover:text-white">Edit weekly plan</Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
            {days.map((day) => {
              const isComplete = completedDayIds.has(day.id);
              return (
                <div key={day.id} className={`flex min-h-52 flex-col rounded-lg border bg-black p-4 ${day.is_rest_day ? "border-zinc-800" : "border-blood/50"}`}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{day.day_of_week}</p>
                  <h3 className="mt-2 text-lg font-black">{day.training_focus}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{day.is_rest_day ? "Recovery and mobility" : `${day.planned_exercises?.length ?? 0} exercises`}</p>
                  {!day.is_rest_day ? <p className="mt-1 text-sm text-zinc-400">{day.estimated_duration} minutes</p> : null}
                  <span className={`mt-3 inline-flex w-fit rounded-md px-2 py-1 text-xs font-bold ${isComplete ? "bg-emerald-500/15 text-emerald-300" : day.is_rest_day ? "bg-zinc-800 text-zinc-300" : "bg-blood/15 text-red-200"}`}>
                    Status: {isComplete ? "Complete" : day.is_rest_day ? "Recovery" : "Not Started"}
                  </span>
                  {day.is_rest_day ? (
                    <Link href="/plan" className="mt-auto inline-flex items-center justify-center rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-blood">
                      View Recovery Plan
                    </Link>
                  ) : (
                    <form action={startWorkoutAction.bind(null, day.id)} className="mt-auto">
                      <button className="w-full rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-blood">Start Workout</button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <ProgressRing value={consistency} label="Consistency score" />
            <p className="mt-4 text-sm text-zinc-400">Complete your scheduled workouts to raise this score. Rest days do not count against you.</p>
          </Card>
          <Card>
            <h2 className="text-xl font-black">Quick actions</h2>
            <div className="mt-4 grid gap-2">
              <Link className="rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-blood" href="/nutrition"><Salad className="mr-2 inline h-4 w-4" />Review meals</Link>
              <Link className="rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-blood" href="/library"><Dumbbell className="mr-2 inline h-4 w-4" />Learn exercise form</Link>
              <Link className="rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-blood" href="/progress"><CalendarCheck className="mr-2 inline h-4 w-4" />Log body metrics</Link>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-black">Recent activity</h2>
            <div className="mt-4 space-y-2">
              {sessions.length ? sessions.slice(0, 4).map((session) => (
                <p key={session.id} className="rounded-md bg-black p-3 text-sm text-zinc-300"><Flame className="mr-2 inline h-4 w-4 text-ember" />{session.workout_name} · {new Date(session.started_at).toLocaleDateString()} · {session.status}</p>
              )) : logs.length ? logs.slice(0, 4).map((log) => (
                <p key={log.id} className="rounded-md bg-black p-3 text-sm text-zinc-300"><Flame className="mr-2 inline h-4 w-4 text-ember" />Workout tracked · {new Date(log.completed_at).toLocaleDateString()}</p>
              )) : <p className="text-sm text-zinc-400">No workouts tracked yet. Start with today’s plan.</p>}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
