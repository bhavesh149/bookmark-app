"use client";

import { useState, useMemo } from "react";
import type { Bookmark, FilterType } from "@/types/bookmark";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { useDeleteBookmark, useToggleFavorite } from "@/lib/hooks/use-bookmark-mutations";
import { BookmarkList } from "./bookmark-list";
import { DeleteDialog } from "./delete-dialog";
import { EmptyState } from "./empty-state";
import { FilterBar } from "./filter-bar";
import { useSearchParams } from "next/navigation";
import { Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkDashboardProps {
  initialBookmarks: Bookmark[];
  user: {
    id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
  };
  hideHeader?: boolean;
}

export function BookmarkDashboard({
  initialBookmarks,
  user,
  hideHeader = false,
}: BookmarkDashboardProps) {
  const {
    bookmarks,
    isLoading,
    allTags,
  } = useBookmarks(initialBookmarks);

  const deleteBookmarkMutation = useDeleteBookmark();
  const toggleFavoriteMutation = useToggleFavorite();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [deleteTarget, setDeleteTarget] = useState<Bookmark | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter and search bookmarks
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks;

    if (activeFilter === "favorites") {
      filtered = filtered.filter((b) => b.favorite);
    } else if (activeFilter.startsWith("tag:")) {
      const tag = activeFilter.slice(4);
      filtered = filtered.filter((b) => b.tags.includes(tag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [bookmarks, activeFilter, searchQuery]);

  const handleDeleteRequest = (id: string) => {
    const bookmark = bookmarks.find((b) => b.id === id);
    if (bookmark) {
      setDeleteTarget(bookmark);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return false;
    try {
      await deleteBookmarkMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      return true;
    } catch {
      return false;
    }
  };

  const displayName = user.name || user.email?.split("@")[0] || "User";

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        {!hideHeader ? (
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Good morning, {displayName.split(" ")[0]}.
            </h1>
            <p className="text-muted-foreground text-sm">
              {bookmarks.length === 0
                ? "You haven't saved any bookmarks yet."
                : `You've saved ${bookmarks.length} bookmark${bookmarks.length !== 1 ? "s" : ""} so far.`}
            </p>
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-xl transition-all flex items-center justify-center border",
              viewMode === "grid" 
                ? "bg-accent border-border text-foreground" 
                : "bg-transparent border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-xl transition-all flex items-center justify-center border",
              viewMode === "list" 
                ? "bg-accent border-border text-foreground" 
                : "bg-transparent border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          allTags={allTags}
          bookmarkCount={bookmarks.length}
          favoriteCount={bookmarks.filter(b => b.favorite).length}
        />
      </div>

      {filteredBookmarks.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
        )}>
          <BookmarkList
            bookmarks={filteredBookmarks}
            onDelete={handleDeleteRequest}
            onToggleFavorite={(id, current) => 
              toggleFavoriteMutation.mutate({ id, isFavorite: !current })
            }
          />
        </div>
      ) : (
        <EmptyState
          onAddClick={() => document.dispatchEvent(new CustomEvent('open-add-modal'))}
          isFiltered={activeFilter !== "all" || searchQuery.length > 0}
        />
      )}

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        bookmarkTitle={deleteTarget?.title || ""}
      />
    </div>
  );
}
