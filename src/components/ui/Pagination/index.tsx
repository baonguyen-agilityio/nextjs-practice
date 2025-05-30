"use client";

import { Pagination as HeroPagination } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  total: number;
  page: number;
};

export default function Pagination({ total, page }: Props) {
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
        cursor: "bg-background text-white",
      }}
      total={total}
      page={page}
      onChange={onChange}
    />
  );
}
