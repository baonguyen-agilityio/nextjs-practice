"use client";

import type { PaginationProps } from "@heroui/react";
import { Pagination as HeroPagination } from "@heroui/react";

export default function Pagination({ total, initialPage, onChange }: PaginationProps) {
  return (
    <HeroPagination
      classNames={{
        cursor: "bg-primary text-white font-inter",
        item: "font-inter",
      }}
      total={total}
      initialPage={initialPage}
      showControls
      disableCursorAnimation
      onChange={onChange}
    />
  );
}
