"use client";

import { Card, Skeleton } from "@heroui/react";

export default function SkeletonCard() {
  return (
    <Card className="space-y-5 p-4" radius="lg" shadow="none">
      <div className="flex gap-4 justify-between">
        <Skeleton className="rounded-lg w-1/2 h-64 bg-default-300" />
        <div className="w-1/2 flex flex-col gap-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="flex flex-col gap-3" key={index}>
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
          ))}
        </div>
      </div>
    </Card>
  );
}
