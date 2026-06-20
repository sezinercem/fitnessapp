import { CheckCircle2, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, EmptyState, LinkButton, ProgressRing, StatCard } from "@/components/ui";
import { getAuthedData } from "@/lib/data";
import { planTemplates } from "@/lib/sample-data";
import type { WorkoutDay } from "@/lib/types";

export default async function DashboardPage() {
  const { profile, plan, nutrition, logs } = await getAuthedData();
  const days = ((plan?.workout_days ?? []) as WorkoutDay[]).sort((a, b) => a.sort_order - b.sort_order);
  const weekDone = logs.length;
  const completion = days.length ? Math.min(100, Math.round((weekDone / days.length) * 100)) : 0;
  const todaysWorkout = days[weekDone % Math.max(days.length, 1)];

  return (
    <AppShell>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
        </div>
        <LinkButton href="/plan">Open plan</LinkButton>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active plan" value={plan?.name ?? "None"} icon="dumbbell" />
        <StatCard label="Today" value={todaysWorkout?.day_name ?? "Pick plan"} icon="flame" />
        <StatCard label="Streak" value={`${weekDone} workouts`} icon="trophy" />
        <StatCard label="Calories" value={nutrition ? `${nutrition.daily_calories}` : "Set target"} icon="salad" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        {plan ? (
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">Current workout plan</h2>
                <p className="mt-1 text-sm text-zinc-400">{plan.goal} · {plan.experience} · {plan.equipment}</p>
              </div>
              <ProgressRing value={completion} label="Plan progress" />
            </div>
            <div className="mt-5 grid gap-3">
              {days.slice(0, 4).map((day) => (
                <div key={day.id} className="flex items-center justify-between rounded-lg border border-line bg-black p-4">
                  <div>
                    <p className="font-black">{day.day_name}</p>
                    <p className="text-sm text-zinc-400">{day.workout_exercises?.length ?? 0} exercises</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-ember" />
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <EmptyState
            title="Pick your first plan"
            body="Choose a template or create a plan from scratch to unlock the full dashboard."
            action={<LinkButton href="/plan">Choose plan</LinkButton>}
          />
        )}

        <Card>
          <h2 className="text-2xl font-black">Recommended workouts</h2>
          <div className="mt-4 space-y-3">
            {planTemplates.slice(0, 3).map((item) => (
              <Link key={item.name} href="/recommendations" className="block rounded-lg border border-line bg-black p-4 transition hover:border-blood">
                <p className="font-black">{item.name}</p>
                <p className="mt-1 text-sm text-zinc-400">{item.goal} · {item.equipment}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-black">Nutrition summary</h2>
          <p className="mt-3 text-3xl font-black text-ember">{nutrition?.protein_target ?? 0}g</p>
          <p className="text-sm text-zinc-400">Protein target</p>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            <Link className="rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-blood" href="/nutrition"><Plus className="mr-2 inline h-4 w-4" />Edit nutrition</Link>
            <Link className="rounded-md border border-line px-3 py-2 text-sm font-bold hover:border-blood" href="/library"><Sparkles className="mr-2 inline h-4 w-4" />Study exercise form</Link>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Recent activity</h2>
          <div className="mt-4 space-y-2">
            {logs.length ? logs.slice(0, 4).map((log) => (
              <p key={log.id} className="rounded-md bg-black p-3 text-sm text-zinc-300">Workout completed · {new Date(log.completed_at).toLocaleDateString()}</p>
            )) : <p className="text-sm text-zinc-400">No workouts logged yet.</p>}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
