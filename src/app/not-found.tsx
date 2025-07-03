"use client";

import { Banner } from "@/components/ui/Banner";
import { NotFoundEmptyState } from "@/components/ui/EmptyState/variants";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <Banner
        title="Page Error"
        description="There are many variations of passages of Lorem Ipsum available,  have suffered alteration in some form."
      />
      <div className="min-h-screen w-full flex items-center justify-center px-4 relative">
        <Image
          src="/notfound.png"
          alt="Page not found background"
          fill
          className="object-cover"
          quality={75}
          priority={false}
          sizes="100vw"
        />
        <div className="relative z-10">
          <NotFoundEmptyState onGoHome={() => router.push("/")} />
        </div>
      </div>
    </>
  );
}
