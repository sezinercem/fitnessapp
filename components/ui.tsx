import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, Dumbbell, Flame, Salad, Target, Trophy } from "lucide-react";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blood px-4 py-2.5 text-center text-sm font-bold text-slate-950 transition hover:bg-ember disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={clsx("inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blood px-4 py-2.5 text-center text-sm font-bold text-slate-950 transition hover:bg-ember", className)}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function GhostLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-center text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-slate-950">
      {children}
    </Link>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={clsx("rounded-lg border border-line bg-panel p-4 shadow-glow sm:p-5", className)}>{children}</section>;
}

export function StatCard({ label, value, icon }: { label: string; value: string; icon: "flame" | "target" | "salad" | "trophy" | "dumbbell" }) {
  const icons = {
    flame: Flame,
    target: Target,
    salad: Salad,
    trophy: Trophy,
    dumbbell: Dumbbell
  };
  const Icon = icons[icon];
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-md bg-emerald-100 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export function ProgressRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="ring-progress grid h-20 w-20 place-items-center rounded-full" style={{ "--progress": `${Math.min(100, Math.max(0, value))}%` } as React.CSSProperties}>
        <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-lg font-black text-slate-950">{value}%</div>
      </div>
      <div>
        <p className="font-bold">{label}</p>
        <p className="text-sm text-slate-500">Weekly completion</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <Card className="border-dashed text-center">
      <p className="text-xl font-black">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}
