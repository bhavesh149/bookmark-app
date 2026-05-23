"use client";

import { Bookmark, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyStateProps {
  onAddClick: () => void;
  isFiltered?: boolean;
}

export function EmptyState({ onAddClick, isFiltered }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Bookmark className="h-10 w-10 text-primary/60" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full premium-btn flex items-center justify-center">
          <Plus className="h-3 w-3" />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {isFiltered ? "No bookmarks match this filter" : "No bookmarks yet"}
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        {isFiltered
          ? "Try adjusting your filters or add a new bookmark."
          : "Save your first link to get started. Your bookmarks sync in real-time across all your tabs."}
      </p>

      {!isFiltered && (
        <Button
          onClick={onAddClick}
          className="gap-2 premium-btn rounded-xl h-11 px-6"
        >
          <Plus className="h-4 w-4" />
          Add Your First Bookmark
        </Button>
      )}
    </motion.div>
  );
}
