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
    title: "Choose your routine style",
    helper: "Use the Apex recommendation, or choose the focus for each training day yourself.",
    fields: [
      { name: "routineType", label: "Routine type", options: ["Use Apex recommendation", "Build my own routine"] },
      { name: "splitPreference", label: "Recommended split", options: ["recommended", "ppl_upper_lower", "upper_lower_ppl", "full_body_cardio"] }
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
  },
  {
    title: "Preview your first week",
    helper: "Check the structure before saving. You can edit exercises, sets, reps and rest periods immediately in Training.",
    fields: []
  }
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const focusOptions = [
  ["push", "Push"],
  ["pull", "Pull"],
  ["legs", "Legs"],
  ["upper", "Upper Body"],
  ["lower", "Lower Body"],
  ["full_body", "Full Body"],
  ["cardio", "Cardio"],
  ["mobility", "Mobility"],
  ["rest", "Rest"]
];

const recommendedFocus = ["Push", "Pull", "Legs", "Upper Body", "Mobility", "Full Body", "Conditioning"];

export function OnboardingForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({
    mainGoal: "Build muscle",
    experienceLevel: "Beginner",
    selectedTrainingDays: "Monday,Tuesday,Thursday,Saturday",
    routineType: "Use Apex recommendation",
    splitPreference: "recommended",
    customSplit: "{}",
    focus_Monday: "push",
    focus_Tuesday: "pull",
    focus_Wednesday: "rest",
    focus_Thursday: "legs",
    focus_Friday: "upper",
    focus_Saturday: "mobility",
    focus_Sunday: "rest",
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
  const customSplit = Object.fromEntries(selectedDays.map((day) => [day, values[`focus_${day}`] === "rest" ? "mobility" : values[`focus_${day}`] || "full_body"]));
  const toggleDay = (day: string) => {
    const next = selectedDays.includes(day) ? selectedDays.filter((item) => item !== day) : [...selectedDays, day];
    setValue("selectedTrainingDays", next.join(","));
  };
  const canContinue = step !== 1 || selectedDays.length > 0;

  return (
    <form action={action} className="mx-auto max-w-3xl">
      {Object.entries({ ...values, customSplit: JSON.stringify(customSplit) }).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm font-bold text-slate-500">
          <span>Step {step + 1} of {steps.length}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-panel2">
          <div className="h-full rounded-full bg-blood transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-3xl font-black">{steps[step].title}</h1>
            <p className="mt-2 text-sm text-slate-500">{steps[step].helper}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {steps[step].fields.map((field) => (
            <label key={field.name} className="space-y-2 text-sm font-bold text-slate-600">
              {field.label}
              <select value={values[field.name]} onChange={(event) => setValue(field.name, event.target.value)} required>
                {field.options.map((option) => (
                  <option key={option} value={field.name === "sessionLength" ? option.split(" ")[0] : option}>
                    {field.name === "sessionLength" ? `${option} minutes` : splitLabel(option)}
                  </option>
                ))}
              </select>
            </label>
          ))}

          {step === 1 ? (
            <div className="rounded-lg border border-line bg-slate-50 p-4">
              <p className="font-black">Which days would you like to train?</p>
              <p className="mt-1 text-sm text-slate-500">Select at least 1 day. Apex will automatically make every other day a rest/recovery day.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {weekDays.map((day) => {
                  const checked = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`flex items-center gap-3 rounded-md border px-4 py-3 text-left text-sm font-bold transition ${checked ? "border-emerald-300 bg-emerald-100 text-slate-950" : "border-line bg-panel text-slate-600 hover:border-emerald-300"}`}
                    >
                      <span className={`grid h-5 w-5 place-items-center rounded border ${checked ? "border-emerald-300 bg-blood" : "border-zinc-600"}`}>
                        {checked ? "✓" : ""}
                      </span>
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs font-bold text-slate-500">{selectedDays.length} selected · {7 - selectedDays.length} recovery days</p>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4">
              {values.routineType === "Use Apex recommendation" ? (
                <div className="rounded-lg border border-line bg-slate-50 p-4">
                  <p className="font-black">Apex will keep exercises matched to the day type.</p>
                  <p className="mt-1 text-sm text-slate-500">Push days only use push exercises. Pull days only use pull exercises. Rest days never include strength workouts.</p>
                </div>
              ) : (
                <div className="rounded-lg border border-line bg-slate-50 p-4">
                  <p className="font-black">Pick the focus for each selected day</p>
                  <p className="mt-1 text-sm text-slate-500">Apex will filter exercises from the matching category.</p>
                  <div className="mt-4 grid gap-3">
                    {selectedDays.map((day) => (
                      <label key={day} className="grid gap-2 text-sm font-bold text-slate-600 sm:grid-cols-[140px_1fr] sm:items-center">
                        {day}
                        <select value={values[`focus_${day}`]} onChange={(event) => setValue(`focus_${day}`, event.target.value)}>
                          {focusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {step === 5 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-slate-600">Current weight<input value={values.currentWeight} onChange={(event) => setValue("currentWeight", event.target.value)} type="number" step="0.1" placeholder="Enter your current weight, e.g. 82kg" required /></label>
              <label className="space-y-2 text-sm font-bold text-slate-600">Target weight<input value={values.targetWeight} onChange={(event) => setValue("targetWeight", event.target.value)} type="number" step="0.1" placeholder="Enter your target weight, e.g. 78kg" required /></label>
              <label className="space-y-2 text-sm font-bold text-slate-600">Height<input value={values.height} onChange={(event) => setValue("height", event.target.value)} type="number" step="0.1" placeholder="Enter your height, e.g. 178cm" required /></label>
              <label className="space-y-2 text-sm font-bold text-slate-600">Age<input value={values.age} onChange={(event) => setValue("age", event.target.value)} type="number" placeholder="Enter your age, e.g. 32" required /></label>
            </div>
          ) : null}

          {step === 6 ? (
            <div className="grid gap-3">
              {weekDays.map((day) => {
                const trainingIndex = selectedDays.indexOf(day);
                const isTraining = trainingIndex >= 0;
                const customFocus = splitLabel(values[`focus_${day}`] || "full_body");
                const focus = values.routineType === "Build my own routine" ? customFocus : recommendedFocus[trainingIndex] ?? "Full Body";
                return (
                  <div key={day} className={`rounded-lg border p-4 ${isTraining ? "border-emerald-300 bg-emerald-50" : "border-line bg-slate-50"}`}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-black">{day}</p>
                      <p className="text-sm font-bold text-slate-600">{isTraining ? focus : "Rest / recovery"}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {isTraining ? "Apex will add category-matched exercises. You can replace or reorder them after saving." : "No strength workout. Mobility, walking and recovery are prioritised."}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-emerald-300 disabled:opacity-40" disabled={step === 0}>
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

function splitLabel(value: string) {
  const labels: Record<string, string> = {
    recommended: "Recommended split",
    ppl_upper_lower: "Push / Pull / Legs / Upper / Lower",
    upper_lower_ppl: "Upper / Lower / Push / Pull / Legs",
    full_body_cardio: "Full Body 3x + Cardio 2x"
  };
  return labels[value] ?? value;
}
