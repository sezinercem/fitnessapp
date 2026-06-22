import { Activity, ArrowDown, ArrowUp, ShieldCheck } from "lucide-react";

export function ExerciseVisual({ name }: { name: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
      <div className="relative min-h-[280px] overflow-hidden rounded-lg border border-line bg-gradient-to-br from-panel to-emerald-50 p-6">
        <div className="absolute right-6 top-6 rounded-full border border-emerald-300 px-3 py-1 text-xs font-bold uppercase text-emerald-600">motion guide</div>
        <div className="mx-auto mt-12 grid h-48 w-48 place-items-center rounded-full border border-emerald-300 bg-blood/5">
          <div className="relative h-36 w-28">
            <span className="absolute left-1/2 top-0 h-9 w-9 -translate-x-1/2 rounded-full border-4 border-zinc-100" />
            <span className="absolute left-1/2 top-10 h-20 w-1 -translate-x-1/2 rounded-full bg-zinc-100" />
            <span className="absolute left-2 top-16 h-1 w-24 rotate-12 rounded-full bg-ember" />
            <span className="absolute left-8 top-28 h-1 w-20 rotate-45 rounded-full bg-zinc-100" />
            <span className="absolute left-0 top-28 h-1 w-20 -rotate-45 rounded-full bg-zinc-100" />
          </div>
        </div>
        <p className="mt-5 text-center text-sm font-bold text-slate-600">{name} position path</p>
      </div>
      <div className="grid gap-3">
        {[
          ["Setup", "Brace, stack joints, and set the start position.", Activity],
          ["Lower", "Control the eccentric with steady tempo.", ArrowDown],
          ["Drive", "Move with intent while keeping alignment.", ArrowUp],
          ["Own it", "Finish clean and reset before the next rep.", ShieldCheck]
        ].map(([title, body, Icon]) => (
          <div key={String(title)} className="rounded-lg border border-line bg-panel p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-emerald-100 text-emerald-600">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-black">{title as string}</p>
                <p className="mt-1 text-sm text-slate-500">{body as string}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
