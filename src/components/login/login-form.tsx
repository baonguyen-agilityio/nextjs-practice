"use client";

import { FormInput } from "@/components/ui/form-input";
import { useActionState, useState } from "react";
import { authenticate } from "@/lib/actions";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <form action={formAction} className="space-y-6">
        <FormInput
          id="email"
          name="email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={setEmail}
        />

        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          required
          value={password}
          onChange={setPassword}
        />

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

        <button
          disabled={isPending}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-darkblue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
