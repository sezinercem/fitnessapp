import Link from "next/link";
import { redirect } from "next/navigation";
import { Dumbbell, Home, LineChart, LogOut, Salad, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/training", label: "Training", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", icon: Salad },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings }
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-ink text-slate-950">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-line bg-white/95 p-5 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-blood text-slate-950">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-xl font-black">Apex</span>
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold text-slate-600 transition hover:bg-panel2 hover:text-slate-950">
              <item.icon className="h-4 w-4 text-emerald-600" />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOutAction} className="absolute bottom-5 left-5 right-5">
          <button className="flex w-full items-center gap-3 rounded-md border border-line px-3 py-3 text-sm font-bold text-slate-600 hover:border-emerald-300 hover:text-slate-950">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </aside>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-blood text-slate-950">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-lg font-black">Apex</span>
        </Link>
        <form action={signOutAction}>
          <button className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line px-3 text-xs font-bold text-slate-600">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </header>
      <main className="pb-28 lg:ml-64 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">{children}</div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-line bg-white/95 px-2 py-2 lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-bold text-slate-600">
              <item.icon className="h-5 w-5 text-emerald-600" />
              {item.label.split(" ")[0]}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
