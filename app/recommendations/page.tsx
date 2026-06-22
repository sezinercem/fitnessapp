import { AppShell } from "@/components/app-shell";
import { RecommendationPicker } from "@/components/recommendation-picker";

export default function RecommendationsPage() {
  return (
    <AppShell>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Recommended workouts</p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">Find the right training block</h1>
      <p className="mt-3 max-w-2xl text-slate-500">Select your goal, experience, and equipment to surface the closest plan templates.</p>
      <div className="mt-6">
        <RecommendationPicker />
      </div>
    </AppShell>
  );
}
