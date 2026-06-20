import Link from "next/link";
import { Activity, Dumbbell, Flame, ShieldCheck } from "lucide-react";
import { GhostLink, LinkButton } from "@/components/ui";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(225,29,47,0.2),transparent_45%)]" />
        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl content-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-blood"><Dumbbell className="h-5 w-5" /></span>
              <span className="text-xl font-black">fitnessapp</span>
            </Link>
            <h1 className="mt-10 max-w-3xl text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl">fitnessapp</h1>
            <p className="mt-6 max-w-2xl text-lg text-zinc-300">
              A premium black-and-red command center for workout plans, nutrition, recommendations, and exercise explainers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/signup">Start training</LinkButton>
              <GhostLink href="/login">Log in</GhostLink>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-panel p-5 shadow-glow">
            <div className="grid gap-4">
              {[
                ["Today", "Upper power", "5 movements", Flame],
                ["Plan", "Gym 4-day split", "82% week complete", Activity],
                ["Nutrition", "2,420 kcal", "185g protein", ShieldCheck]
              ].map(([label, title, sub, Icon]) => (
                <div key={String(label)} className="rounded-lg border border-line bg-black p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label as string}</p>
                      <p className="mt-2 text-2xl font-black">{title as string}</p>
                      <p className="mt-1 text-sm text-zinc-400">{sub as string}</p>
                    </div>
                    <span className="grid h-12 w-12 place-items-center rounded-md bg-blood/15 text-ember">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
