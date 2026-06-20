"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button, Card } from "@/components/ui";

const steps = [
  {
    title: "What are you training for?",
    helper: "This shapes the weekly plan, exercise selection, and nutrition targets.",
    fields: [{ name: "mainGoal", label: "Main goal", options: ["Build muscle", "Lose fat", "Get stronger", "Improve fitness", "Hybrid athlete", "General health"] }]
  },
  {
    title: "How should training fit your week?",
    helper: "Choose the exact days you can train. Non-selected days become rest and recovery days.",
    fields: [
      { name: "experienceLevel", label: "Experience level", options: ["Beginner", "Intermediate", "Advanced"] },
      { name: "sessionLength", label: "Session length", options: ["20", "30", "45", "60", "90"] }
    ]
  },
  {
    title: "What equipment do you have?",
    helper: "Your plan will only use exercises that match your setup.",
    fields: [{ name: "equipmentAvailable", label: "Equipment available", options: ["Bodyweight only", "Dumbbells", "Barbell", "Full gym", "Home gym", "Resistance bands"] }]
  },
  {
    title: "Set up nutrition",
    helper: "We will create simple targets and starter meals you can edit later.",
    fields: [
      { name: "nutritionGoal", label: "Nutrition goal", options: ["Fat loss", "Maintenance", "Muscle gain", "Performance"] },
      { name: "dietaryPreference", label: "Dietary preference", options: ["No preference", "High protein", "Vegetarian", "Vegan", "Halal", "Gluten free"] }
    ]
  },
  {
    title: "Your starting point",
    helper: "These numbers help estimate calories and create progress trackers.",
    fields: []
  }
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function OnboardingForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({
    mainGoal: "Build muscle",
    experienceLevel: "Beginner",
    selectedTrainingDays: "Monday,Tuesday,Thursday,Saturday",
    equipmentAvailable: "Dumbbells",
    sessionLength: "45",
    nutritionGoal: "Muscle gain",
    dietaryPreference: "No preference",
    currentWeight: "",
    targetWeight: "",
    height: "",
    age: ""
  });
  const progress = Math.round(((step + 1) / steps.length) * 100);
  const setValue = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const selectedDays = values.selectedTrainingDays.split(",").filter(Boolean);
  const toggleDay = (day: string) => {
    const next = selectedDays.includes(day) ? selectedDays.filter((item) => item !== day) : [...selectedDays, day];
    setValue("selectedTrainingDays", next.join(","));
  };
  const canContinue = step !== 1 || selectedDays.length > 0;

  return (
    <form action={action} className="mx-auto max-w-3xl">
      {Object.entries(values).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm font-bold text-zinc-400">
          <span>Step {step + 1} of {steps.length}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-panel2">
          <div className="h-full rounded-full bg-blood transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-blood/15 text-ember">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-3xl font-black">{steps[step].title}</h1>
            <p className="mt-2 text-sm text-zinc-400">{steps[step].helper}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {steps[step].fields.map((field) => (
            <label key={field.name} className="space-y-2 text-sm font-bold text-zinc-300">
              {field.label}
              <select value={values[field.name]} onChange={(event) => setValue(field.name, event.target.value)} required>
                {field.options.map((option) => (
                  <option key={option} value={field.name === "sessionLength" ? option.split(" ")[0] : option}>{option}{field.name === "sessionLength" ? " minutes" : ""}</option>
                ))}
              </select>
            </label>
          ))}

          {step === 1 ? (
            <div className="rounded-lg border border-line bg-black p-4">
              <p className="font-black">Which days would you like to train?</p>
              <p className="mt-1 text-sm text-zinc-400">Select at least 1 day. Apex will automatically make every other day a rest/recovery day.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {weekDays.map((day) => {
                  const checked = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`flex items-center gap-3 rounded-md border px-4 py-3 text-left text-sm font-bold transition ${checked ? "border-blood bg-blood/15 text-white" : "border-line bg-panel text-zinc-300 hover:border-blood"}`}
                    >
                      <span className={`grid h-5 w-5 place-items-center rounded border ${checked ? "border-blood bg-blood" : "border-zinc-600"}`}>
                        {checked ? "✓" : ""}
                      </span>
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs font-bold text-zinc-500">{selectedDays.length} selected · {7 - selectedDays.length} recovery days</p>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-zinc-300">Current weight<input value={values.currentWeight} onChange={(event) => setValue("currentWeight", event.target.value)} type="number" step="0.1" placeholder="Enter your current weight, e.g. 82kg" required /></label>
              <label className="space-y-2 text-sm font-bold text-zinc-300">Target weight<input value={values.targetWeight} onChange={(event) => setValue("targetWeight", event.target.value)} type="number" step="0.1" placeholder="Enter your target weight, e.g. 78kg" required /></label>
              <label className="space-y-2 text-sm font-bold text-zinc-300">Height<input value={values.height} onChange={(event) => setValue("height", event.target.value)} type="number" step="0.1" placeholder="Enter your height, e.g. 178cm" required /></label>
              <label className="space-y-2 text-sm font-bold text-zinc-300">Age<input value={values.age} onChange={(event) => setValue("age", event.target.value)} type="number" placeholder="Enter your age, e.g. 32" required /></label>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-bold text-zinc-200 hover:border-blood disabled:opacity-40" disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" />Back
          </button>
          {step < steps.length - 1 ? (
            <Button type="button" disabled={!canContinue} onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button>Create my plan</Button>
          )}
        </div>
      </Card>
    </form>
  );
}
