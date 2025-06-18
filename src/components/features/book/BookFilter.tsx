"use client";

import { Input } from "@/components/ui/Input";
import { Select, SelectItem } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/types";
import { useState, useEffect } from "react";

export default function BookFilter({
  categories,
  onSearchChange,
  onCategoryChange,
}: {
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}) {
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  useEffect(() => {
    setSearchValue(searchParams.get("search") ?? "");
    setCategoryValue(searchParams.get("categories") ?? "");
  }, [searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <Input
        type="text"
        placeholder="Search books..."
        aria-label="Search books"
        className="max-w-xs"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          onSearchChange(e.target.value);
        }}
        size="lg"
        isClearable
        onClear={() => {
          setSearchValue("");
          onSearchChange("");
        }}
      />
      <Select
        placeholder="Filter by category"
        aria-label="Filter books by category"
        className="max-w-xs"
        selectedKeys={categoryValue ? [categoryValue] : []}
        onChange={(e) => {
          const value = e.target.value;
          setCategoryValue(value);
          onCategoryChange(value);
        }}
        size="lg"
      >
        {categories.map((category) => (
          <SelectItem key={category.documentId}>{category.name}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
