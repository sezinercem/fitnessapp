import { Brain, Dumbbell, LayoutTemplate, Plus, SplitSquareHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card } from "@/components/ui";
import { createBlankPlanAction, regenerateWeeklyPlanAction } from "@/lib/actions";

const splitIdeas = [
  ["Push Pull Legs", "Balanced muscle-group split for 3-6 training days."],
  ["Upper Lower", "Simple structure for strength, recovery and repeatable progress."],
  ["Bro Split", "One major muscle-group focus per session."],
  ["Hybrid Athlete", "Strength, conditioning and mobility in the same week."],
  ["Custom Split", "Build your own week around your schedule and preferences."]
];

export default function WorkoutBuilderPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Workout builder</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Build training your way</h1>
          <p className="mt-2 max-w-2xl text-slate-500">Start from a blank programme, use Apex recommendations, or choose a split idea. Nothing is locked after it is created.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-100 text-emerald-700">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-black">Manual programme</h2>
              <p className="mt-1 text-sm text-slate-500">Create a blank plan, then add days and exercises in Training.</p>
            </div>
          </div>
          <form action={createBlankPlanAction} className="mt-5 grid gap-3">
            <input name="name" placeholder="Programme name, e.g. Custom Upper Lower" required />
            <input name="goal" placeholder="Goal, e.g. Build muscle and strength" required />
            <input name="experience" placeholder="Experience, e.g. Intermediate" required />
            <input name="equipment" placeholder="Equipment, e.g. Full gym" required />
            <Button><Dumbbell className="h-4 w-4" />Create blank programme</Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-100 text-emerald-700">
              <Brain className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-black">Apex recommendation</h2>
              <p className="mt-1 text-sm text-slate-500">Regenerate from your onboarding goal, days, experience and equipment.</p>
            </div>
          </div>
          <form action={regenerateWeeklyPlanAction} className="mt-5">
            <Button><Brain className="h-4 w-4" />Use Apex recommendation</Button>
          </form>
          <p className="mt-4 rounded-lg border border-line bg-slate-50 p-4 text-sm text-slate-600">
            Apex recommendations are a starting point. You can replace exercises, adjust sets and reps, move sessions, or turn any day into rest.
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-100 text-emerald-700">
            <SplitSquareHorizontal className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-black">Training split ideas</h2>
            <p className="mt-1 text-sm text-slate-500">Use these as structure, then customise the actual days and exercises.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {splitIdeas.map(([name, body]) => (
            <div key={name} className="rounded-lg border border-line bg-slate-50 p-4">
              <LayoutTemplate className="h-5 w-5 text-emerald-600" />
              <p className="mt-4 font-black">{name}</p>
              <p className="mt-2 text-sm text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
