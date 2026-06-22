import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui";
import { signUpAction } from "@/lib/actions";

async function signup(_: unknown, formData: FormData) {
  "use server";
  return signUpAction(formData);
}

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 py-10">
      <Card className="w-full max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Apex</p>
        <h1 className="mt-3 text-3xl font-black">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">Build your plan, track your streak, and keep nutrition tight.</p>
        <div className="mt-6">
          <AuthForm mode="signup" action={signup} />
        </div>
        <p className="mt-5 text-sm text-slate-500">Already training? <Link className="font-bold text-emerald-600" href="/login">Log in</Link></p>
      </Card>
    </main>
  );
}
