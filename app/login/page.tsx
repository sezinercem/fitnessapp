import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui";
import { forgotPasswordAction, signInAction } from "@/lib/actions";

async function login(_: unknown, formData: FormData) {
  "use server";
  return signInAction(formData);
}

async function forgot(formData: FormData) {
  "use server";
  await forgotPasswordAction(formData);
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 py-10">
      <Card className="w-full max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">Apex</p>
        <h1 className="mt-3 text-3xl font-black">Log in</h1>
        <p className="mt-2 text-sm text-zinc-400">Continue to your training dashboard.</p>
        <div className="mt-6">
          <AuthForm mode="login" action={login} />
        </div>
        <form action={forgot} className="mt-4 flex gap-2">
          <input name="email" type="email" placeholder="Email for reset link" className="text-sm" />
          <button className="rounded-md border border-line px-3 text-sm font-bold text-zinc-300 hover:border-blood">Reset</button>
        </form>
        <p className="mt-5 text-sm text-zinc-400">No account? <Link className="font-bold text-ember" href="/signup">Sign up</Link></p>
      </Card>
    </main>
  );
}
