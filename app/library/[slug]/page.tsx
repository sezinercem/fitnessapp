import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";
import { ExerciseVisual } from "@/components/exercise-visual";
import { exercises } from "@/lib/sample-data";

export default async function ExerciseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exercise = exercises.find((item) => item.slug === slug);
  if (!exercise) notFound();

  return (
    <AppShell>
      <Link href="/library" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to library</Link>
      <div className="mt-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">{exercise.equipment}</p>
        <h1 className="mt-2 text-4xl font-black sm:text-5xl">{exercise.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {exercise.muscle_groups.map((group) => <span key={group} className="rounded-md border border-blood/40 bg-blood/10 px-3 py-1 text-sm font-bold text-red-100">{group}</span>)}
          <span className="rounded-md border border-line px-3 py-1 text-sm font-bold text-zinc-300">{exercise.difficulty}</span>
        </div>
      </div>

      <div className="mt-6">
        <ExerciseVisual name={exercise.name} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-black">Step-by-step</h2>
          <ol className="mt-4 space-y-3">
            {exercise.instructions.map((item, index) => <li key={item} className="text-sm text-zinc-300"><span className="mr-2 font-black text-ember">{index + 1}.</span>{item}</li>)}
          </ol>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Common mistakes</h2>
          <ul className="mt-4 space-y-3">
            {exercise.mistakes.map((item) => <li key={item} className="text-sm text-zinc-300">{item}</li>)}
          </ul>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Safety tips</h2>
          <ul className="mt-4 space-y-3">
            {exercise.safety_tips.map((item) => <li key={item} className="text-sm text-zinc-300">{item}</li>)}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-xl font-black">Related exercises</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {exercise.related.map((item) => <span key={item} className="rounded-md border border-line bg-black px-3 py-2 text-sm font-bold text-zinc-300">{item}</span>)}
        </div>
      </Card>
    </AppShell>
  );
}
