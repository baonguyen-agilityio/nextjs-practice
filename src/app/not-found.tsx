"use client";

import { NotFoundEmptyState } from "@/components/ui/EmptyState/variants";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center px-4">
      <NotFoundEmptyState onGoHome={() => router.push("/")} />
    </div>
  );
}
