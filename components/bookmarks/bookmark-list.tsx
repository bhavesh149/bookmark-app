"use client";

import type { Bookmark } from "@/types/bookmark";
import { BookmarkCard } from "./bookmark-card";
import { AnimatePresence } from "framer-motion";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
}

export function BookmarkList({
  bookmarks,
  onDelete,
  onToggleFavorite,
}: BookmarkListProps) {
  return (
    <>
      <AnimatePresence mode="popLayout">
        {bookmarks.map((bookmark, index) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            index={index}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
