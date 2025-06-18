"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@heroui/react";

export const DynamicEditBookModal = dynamic(() => import("./EditBookModal"), {
  loading: () => (
    <Skeleton className="w-full h-10 rounded">
      <div className="h-full w-full bg-default-300" />
    </Skeleton>
  ),
  ssr: false,
});

export const DynamicDeleteBookModal = dynamic(() => import("./DeleteBookModal"), {
  loading: () => (
    <Skeleton className="w-full h-10 rounded">
      <div className="h-full w-full bg-default-300" />
    </Skeleton>
  ),
  ssr: false,
});

export const DynamicCreateBookModal = dynamic(() => import("./CreateBookModal"), {
  loading: () => (
    <Skeleton className="w-full h-10 rounded">
      <div className="h-full w-full bg-default-300" />
    </Skeleton>
  ),
  ssr: false,
});

export function LazyEditBookModal(props: React.ComponentProps<typeof DynamicEditBookModal>) {
  return (
    <Suspense
      fallback={
        <Skeleton className="w-full h-10 rounded">
          <div className="h-full w-full bg-default-300" />
        </Skeleton>
      }
    >
      <DynamicEditBookModal {...props} />
    </Suspense>
  );
}

export function LazyDeleteBookModal(props: React.ComponentProps<typeof DynamicDeleteBookModal>) {
  return (
    <Suspense
      fallback={
        <Skeleton className="w-full h-10 rounded">
          <div className="h-full w-full bg-default-300" />
        </Skeleton>
      }
    >
      <DynamicDeleteBookModal {...props} />
    </Suspense>
  );
}

export function LazyCreateBookModal(props: React.ComponentProps<typeof DynamicCreateBookModal>) {
  return (
    <Suspense
      fallback={
        <Skeleton className="w-full h-10 rounded">
          <div className="h-full w-full bg-default-300" />
        </Skeleton>
      }
    >
      <DynamicCreateBookModal {...props} />
    </Suspense>
  );
}
