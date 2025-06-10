"use client";

import { Inter } from "next/font/google";

import { Button } from "@/components/ui/Button";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <div className="flex flex-col h-full gap-4 items-center justify-center">
            <p className="text-primary-300 font-bold md:text-5xl text-3xl md:leading-10 leading-[28px]">
              Something went wrong
            </p>
            <Button variant="solid" size="md" onClick={() => reset()}>
              Try again
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
