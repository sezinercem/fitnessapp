import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  Flame,
  LineChart,
  PlayCircle,
  Salad,
  ShieldCheck,
  Sparkles,
  Utensils
} from "lucide-react";

const nav = [
  ["Features", "#features"],
  ["Training", "#training"],
  ["Nutrition", "#nutrition"],
  ["Progress", "#progress"]
];

const features = [
  ["Personalised onboarding", "Answer simple questions and Apex builds a plan around your goal, equipment, schedule and experience.", Sparkles],
  ["Weekly training plan", "See Monday to Sunday at a glance, including rest days, training focus, duration and exercises.", CalendarDays],
  ["Workout tracking", "Track sets, reps, weight, rest time, notes and difficulty without losing the flow of your session.", Dumbbell],
  ["Nutrition planning", "Get calories, macros and editable meals with a clear reason behind each choice.", Salad],
  ["Exercise explainers", "Learn form, common mistakes and safety tips with clean visual guides.", PlayCircle],
  ["Progress analytics", "Follow consistency, completed workouts, strength progress, bodyweight and personal records.", BarChart3]
];

const howItWorks = [
  "Sign up",
  "Answer onboarding questions",
  "Get your plan",
  "Track workouts and nutrition",
  "Improve week by week"
];

function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-md bg-blood text-white shadow-glow">
        <Dumbbell className="h-5 w-5" />
      </span>
      <span className="text-xl font-black tracking-normal">Apex</span>
    </Link>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-md bg-blood px-5 py-3 text-sm font-black text-white transition hover:bg-ember">
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center rounded-md border border-line px-5 py-3 text-sm font-black text-zinc-100 transition hover:border-blood hover:text-white">
      {children}
    </Link>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <header className="sticky top-0 z-30 border-b border-line bg-black/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Brand />
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-bold text-zinc-400 transition hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-md border border-line px-4 py-2 text-sm font-bold text-zinc-100 transition hover:border-blood sm:inline-flex">Log in</Link>
            <Link href="/signup" className="rounded-md bg-blood px-4 py-2 text-sm font-black text-white transition hover:bg-ember">Sign up</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(225,29,47,0.24),transparent_42%)]" />
        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="inline-flex rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-100">
              Personalised fitness command centre
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl">
              Train smarter. Eat better. Track everything.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Apex builds your personalised training and nutrition plan, then helps you track every workout, meal and progress marker in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryLink href="/signup">Start free</PrimaryLink>
              <SecondaryLink href="/login">Log in</SecondaryLink>
            </div>
          </div>

          <div className="grid gap-4 rounded-lg border border-line bg-panel p-4 shadow-glow">
            <div className="rounded-lg border border-blood/40 bg-black p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember">Today</p>
                  <p className="mt-2 text-2xl font-black">Monday: Upper Body Strength</p>
                  <p className="mt-1 text-sm text-zinc-400">5 exercises · 45 minutes · track sets and RPE</p>
                </div>
                <Flame className="h-8 w-8 text-ember" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Plan", "4 days/week", CalendarDays],
                ["Nutrition", "2,420 kcal", Utensils],
                ["Progress", "82% consistency", LineChart]
              ].map(([label, value, Icon]) => (
                <div key={String(label)} className="rounded-lg border border-line bg-black p-4">
                  <Icon className="h-5 w-5 text-ember" />
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-zinc-500">{label as string}</p>
                  <p className="mt-1 font-black">{value as string}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-line bg-black p-5">
              <p className="font-black">Workout log</p>
              <div className="mt-4 space-y-3">
                {["Bench Press · 45kg x 8 · RPE 8", "Dumbbell Row · 30kg x 10 · RPE 7", "Notes · Felt strong today"].map((item) => (
                  <p key={item} className="rounded-md bg-panel px-3 py-2 text-sm text-zinc-300">
                    <CheckCircle2 className="mr-2 inline h-4 w-4 text-ember" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">The problem</p>
          <h2 className="mt-3 text-4xl font-black">Most fitness apps make progress feel harder than it should.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
            They are confusing, generic and difficult to stick with. Apex keeps the journey obvious: know what to train today, what to eat, what to track, and how your week is improving.
          </p>
        </div>
      </section>

      <section id="features" className="border-b border-line px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">Features</p>
            <h2 className="mt-3 text-4xl font-black">Everything you need, explained clearly.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map(([title, body, Icon]) => (
              <article key={String(title)} className="rounded-lg border border-line bg-panel p-5 shadow-glow">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-blood/15 text-ember">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-black">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{body as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="training" className="border-b border-line px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">Training</p>
            <h2 className="mt-3 text-4xl font-black">A Monday to Sunday plan that tells you exactly what to do.</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              Apex separates workout days and rest days, recommends training based on your goal, and lets you track sets, reps, weight, notes and difficulty from each session.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Monday · Upper Strength", "Tuesday · Rest day", "Wednesday · Lower Body", "Thursday · Conditioning", "Friday · Push/Pull", "Saturday · Mobility", "Sunday · Rest day"].map((day) => (
              <div key={day} className="rounded-lg border border-line bg-panel p-4">
                <p className="font-black">{day}</p>
                <p className="mt-2 text-sm text-zinc-400">Clear focus, exercise count, estimated duration and track/edit actions.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nutrition" className="border-b border-line px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Calories", "Targets matched to your goal"],
              ["Macros", "Protein, carbs and fats made clear"],
              ["Meals", "Editable meals with simple purpose text"],
              ["Flexibility", "Change foods anytime"]
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border border-line bg-panel p-5">
                <Salad className="h-5 w-5 text-ember" />
                <p className="mt-4 text-xl font-black">{title}</p>
                <p className="mt-2 text-sm text-zinc-400">{body}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">Nutrition</p>
            <h2 className="mt-3 text-4xl font-black">Know what to eat and why it fits your plan.</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              Apex creates an editable meal plan with calories and macros, plus a plain-English reason behind the plan so beginners understand the target instead of guessing.
            </p>
          </div>
        </div>
      </section>

      <section id="progress" className="border-b border-line px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">Progress</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black">Track the markers that actually show improvement.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              ["Completed workouts", Activity],
              ["Strength progress", LineChart],
              ["Bodyweight tracking", ShieldCheck],
              ["Consistency score", BarChart3],
              ["Personal records", Flame]
            ].map(([title, Icon]) => (
              <div key={String(title)} className="rounded-lg border border-line bg-panel p-5">
                <Icon className="h-6 w-6 text-ember" />
                <p className="mt-5 font-black">{title as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-ember">How it works</p>
          <h2 className="mt-3 text-4xl font-black">From sign up to smarter training in five steps.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {howItWorks.map((step, index) => (
              <div key={step} className="rounded-lg border border-line bg-panel p-5">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-blood text-sm font-black">{index + 1}</span>
                <p className="mt-5 font-black">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-lg border border-blood/40 bg-panel p-8 text-center shadow-glow">
          <h2 className="text-4xl font-black">Build your plan in minutes.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">Create your Apex account, answer the onboarding questions, and get a clear training and nutrition plan you can edit as you improve.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <PrimaryLink href="/signup">Sign up</PrimaryLink>
            <SecondaryLink href="/login">Log in</SecondaryLink>
          </div>
        </div>
      </section>
    </main>
  );
}
