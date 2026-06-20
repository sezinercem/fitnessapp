import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { completeOnboardingAction } from "@/lib/actions";
import { getGuidedData } from "@/lib/data";

export default async function OnboardingPage() {
  const { onboarding } = await getGuidedData();
  if (onboarding) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-ink px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Welcome to Apex</p>
        <h1 className="mt-2 text-4xl font-black">Let’s build your first week</h1>
        <p className="mt-3 text-zinc-400">Answer a few beginner-friendly questions. You can edit everything later from the dashboard.</p>
      </div>
      <OnboardingForm action={completeOnboardingAction} />
    </main>
  );
}
