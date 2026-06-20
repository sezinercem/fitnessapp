import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarCheck, Dumbbell, Home, Library, LineChart, LogOut, Salad, Settings, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/actions";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/plan", label: "Plan", icon: CalendarCheck },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/recommendations", label: "Recommended", icon: Sparkles },
  { href: "/nutrition", label: "Nutrition", icon: Salad },
  { href: "/library", label: "Library", icon: Library },
  { href: "/settings", label: "Settings", icon: Settings }
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-ink">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-line bg-black/90 p-5 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-blood text-white">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-xl font-black">Apex</span>
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold text-zinc-300 transition hover:bg-panel2 hover:text-white">
              <item.icon className="h-4 w-4 text-ember" />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOutAction} className="absolute bottom-5 left-5 right-5">
          <button className="flex w-full items-center gap-3 rounded-md border border-line px-3 py-3 text-sm font-bold text-zinc-300 hover:border-blood hover:text-white">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </aside>
      <main className="pb-24 lg:ml-64 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{children}</div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-7 border-t border-line bg-black/95 lg:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-1 py-3 text-[10px] font-bold text-zinc-300">
            <item.icon className="h-5 w-5 text-ember" />
            {item.label.split(" ")[0]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
