"use client";

import { Pagination as HeroPagination } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  total: number;
  initialPage: number;
};

export default function Pagination({ total, initialPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <HeroPagination
      classNames={{
        cursor: "bg-primary text-white font-inter",
        item: "font-inter",
      }}
      total={total}
      page={initialPage}
      showControls
      disableCursorAnimation
      onChange={onChange}
    />
  );
}
