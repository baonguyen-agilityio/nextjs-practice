"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addToast } from "@heroui/react";
import { authenticate } from "@/app/actions";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const formAction = async (prevState: string | undefined, formData: FormData) => {
    const result = await authenticate(prevState, formData);

    if (typeof result === "string") {
      addToast({
        title: "Login failed",
        description: result,
        color: "danger",
      });
    }

    return result;
  };

  const [_, formActionWithToast, isPending] = useActionState(formAction, undefined);

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <form action={formActionWithToast} className="space-y-6">
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

        <Button
          variant="primary"
          fullWidth
          type="submit"
          isLoading={isPending}
          isDisabled={isPending}
        >
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
