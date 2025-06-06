"use client";

import { useActionState, useState } from "react";
import { authenticate } from "@/lib/actions";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <form action={formAction} className="space-y-6">
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isDisabled={isPending}
        />

        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isDisabled={isPending}
        />

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

        <Button fullWidth type="submit" isLoading={isPending} isDisabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
