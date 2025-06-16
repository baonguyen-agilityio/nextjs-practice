"use client";

import { Card } from "@heroui/react";
import { Skeleton } from "@heroui/react";

export default function ArticleSkeleton() {
  return (
    <section className="container mx-auto px-4 max-w-7xl">
      <div className="py-10 md:p-16 lg:p-20">
        <Card className="space-y-5 p-4" radius="lg" shadow="none">
          <Skeleton className="rounded-lg">
            <div className="h-64 rounded-lg bg-default-300" />
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </div>
        </Card>
      </div>
    </section>
  );
}
