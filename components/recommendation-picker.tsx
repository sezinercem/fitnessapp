"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui";
import { planTemplates } from "@/lib/sample-data";

const goals = ["fat loss", "muscle gain", "strength", "endurance", "mobility", "general fitness"];
const levels = ["beginner", "intermediate", "advanced"];
const equipment = ["bodyweight", "dumbbells", "barbell", "gym", "resistance bands", "full home gym"];

export function RecommendationPicker() {
  const [goal, setGoal] = useState("muscle gain");
  const [experience, setExperience] = useState("beginner");
  const [gear, setGear] = useState("dumbbells");

  const matches = useMemo(() => {
    return planTemplates
      .map((plan) => ({
        plan,
        score: Number(plan.goal === goal) * 3 + Number(plan.experience === experience) * 2 + Number(plan.equipment === gear) * 2
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [goal, experience, gear]);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <h2 className="text-2xl font-black">Recommendation inputs</h2>
        <div className="mt-4 grid gap-3">
          <label className="space-y-2 text-sm font-bold text-zinc-300">Goal<select value={goal} onChange={(event) => setGoal(event.target.value)}>{goals.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="space-y-2 text-sm font-bold text-zinc-300">Experience<select value={experience} onChange={(event) => setExperience(event.target.value)}>{levels.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="space-y-2 text-sm font-bold text-zinc-300">Equipment<select value={gear} onChange={(event) => setGear(event.target.value)}>{equipment.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
      </Card>
      <div className="grid gap-4">
        {matches.map(({ plan, score }) => (
          <Card key={plan.name}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">Match score {score + 3}/10</p>
                <h3 className="mt-2 text-2xl font-black">{plan.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{plan.goal} · {plan.experience} · {plan.equipment}</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-md bg-blood/15 text-ember"><Sparkles className="h-5 w-5" /></span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {plan.days.map((day) => (
                <div key={day.dayName} className="rounded-md border border-line bg-black p-3">
                  <p className="font-bold">{day.dayName}</p>
                  <p className="mt-1 text-xs text-zinc-500">{day.exercises.length} exercises</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
