import Link from "next/link";
import { Dumbbell, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";
import { exercises } from "@/lib/sample-data";

export default function LibraryPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Workout library</p>
          <h1 className="mt-2 text-4xl font-black">Exercise visual explainers</h1>
        </div>
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
          <input className="pl-10" placeholder="Search exercises" />
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {exercises.map((exercise) => (
          <Link key={exercise.slug} href={`/library/${exercise.slug}`}>
            <Card className="h-full transition hover:border-blood">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">{exercise.difficulty}</p>
                  <h2 className="mt-2 text-2xl font-black">{exercise.name}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{exercise.muscle_groups.join(", ")}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-md bg-blood/15 text-ember"><Dumbbell className="h-5 w-5" /></span>
              </div>
              <p className="mt-5 rounded-md border border-line bg-black p-3 text-sm text-zinc-400">{exercise.equipment}</p>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
