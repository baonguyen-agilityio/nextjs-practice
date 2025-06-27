"use client";

import { Input } from "@/components/ui/Input";
import { Select, SelectItem } from "@/components/ui/Select";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/types";
import { useState, useEffect, useId } from "react";

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
  const searchId = useId();
  const categoryId = useId();

  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  useEffect(() => {
    setSearchValue(searchParams.get("search") ?? "");
    setCategoryValue(searchParams.get("categories") ?? "");
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryValue(value);
    onCategoryChange(value);
  };

  return (
    <div
      className="flex flex-col md:flex-row gap-4 w-full"
      role="search"
      aria-label="Book filtering options"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={searchId} className="text-sm font-medium text-gray-700 sr-only">
          Search books by title or author
        </label>
        <Input
          id={searchId}
          type="text"
          placeholder="Search books..."
          aria-label="Search books by title or author"
          aria-describedby={`${searchId}-description`}
          className="max-w-xs"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          size="lg"
          isClearable
          onClear={() => handleSearchChange("")}
        />
        <div id={`${searchId}-description`} className="sr-only">
          Type to search books by title or author. Use the clear button to reset search.
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label htmlFor={categoryId} className="text-sm font-medium text-gray-700 sr-only">
          Filter books by category
        </label>
        <Select
          id={categoryId}
          placeholder="Filter by category"
          aria-label="Filter books by category"
          aria-describedby={`${categoryId}-description`}
          className="max-w-xs"
          selectedKeys={categoryValue ? [categoryValue] : []}
          onChange={(e) => handleCategoryChange(e.target.value)}
          size="lg"
        >
          {categories?.map((category) => (
            <SelectItem
              key={category.documentId}
              aria-label={`Filter by ${category.name} category`}
            >
              {category.name}
            </SelectItem>
          ))}
        </Select>
        <div id={`${categoryId}-description`} className="sr-only">
          Select a category to filter books. Choose from {categories.length} available categories.
        </div>
      </div>

      {/* Live region for announcing filter changes */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {searchValue && `Searching for: ${searchValue}`}
        {categoryValue && `, filtered by category`}
      </div>
    </div>
  );
}
