"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/bookmark";

// We use a shared fetch function that React Query will call when needed
async function fetchBookmarksFn(): Promise<Bookmark[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as Bookmark[];
}

export function useBookmarks(initialBookmarks: Bookmark[]) {
  const queryClient = useQueryClient();

  // 1. Core Data Fetching via React Query
  const { data: bookmarks = initialBookmarks, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarksFn,
    initialData: initialBookmarks,
  });

  // 2. Realtime Subscription (Sync external changes directly into the Query Cache)
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        () => {
          // Whenever ANY change happens in the DB (that wasn't from our optimistic UI),
          // we tell React Query to fetch the freshest data.
          queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(bookmarks.flatMap((b) => b.tags))
  ).sort();

  return {
    bookmarks,
    isLoading,
    allTags,
  };
}
