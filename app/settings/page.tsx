import { Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card } from "@/components/ui";
import { updateProfileAction } from "@/lib/actions";
import { getAuthedData } from "@/lib/data";

export default async function SettingsPage() {
  const { user, profile } = await getAuthedData();

  return (
    <AppShell>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Settings</p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">Profile</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-2xl font-black">Logged-in user</h2>
          <p className="mt-3 text-sm text-slate-500">Email</p>
          <p className="font-bold">{user.email}</p>
          <p className="mt-4 text-sm text-slate-500">User ID</p>
          <p className="break-all text-xs text-slate-500">{user.id}</p>
        </Card>
        <Card>
          <h2 className="text-2xl font-black">Training preferences</h2>
          <form action={updateProfileAction} className="mt-4 grid gap-3">
            <input name="fullName" defaultValue={profile?.full_name ?? ""} placeholder="Full name" />
            <select name="goal" defaultValue={profile?.goal ?? "muscle gain"}>
              {["fat loss", "muscle gain", "strength", "endurance", "mobility", "general fitness"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select name="experience" defaultValue={profile?.experience ?? "beginner"}>
              {["beginner", "intermediate", "advanced"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select name="equipment" defaultValue={profile?.equipment ?? "dumbbells"}>
              {["bodyweight", "dumbbells", "barbell", "gym", "resistance bands", "full home gym"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select name="defaultWeightUnit" defaultValue={profile?.default_weight_unit ?? "kg"}>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
            <Button><Save className="h-4 w-4" />Save profile</Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
