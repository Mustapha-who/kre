"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useSearchQuery() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  return query;
}