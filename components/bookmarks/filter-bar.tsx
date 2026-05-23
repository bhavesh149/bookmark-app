"use client";

import { Button } from "@/components/ui/button";
import { Star, Hash, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterType } from "@/types/bookmark";
import { motion } from "framer-motion";

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  allTags: string[];
  bookmarkCount: number;
  favoriteCount: number;
}

export function FilterBar({
  activeFilter,
  onFilterChange,
  allTags,
  bookmarkCount,
  favoriteCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterButton
        active={activeFilter === "all"}
        onClick={() => onFilterChange("all")}
        icon={<LayoutGrid className="h-3.5 w-3.5" />}
        label="All"
        count={bookmarkCount}
      />
      <FilterButton
        active={activeFilter === "favorites"}
        onClick={() => onFilterChange("favorites")}
        icon={<Star className="h-3.5 w-3.5" />}
        label="Favorites"
        count={favoriteCount}
      />

      {allTags.length > 0 && (
        <div className="w-px h-5 bg-border mx-1" />
      )}

      {allTags.map((tag) => (
        <FilterButton
          key={tag}
          active={activeFilter === `tag:${tag}`}
          onClick={() => onFilterChange(`tag:${tag}`)}
          icon={<Hash className="h-3.5 w-3.5" />}
          label={tag}
        />
      ))}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn(
        "relative gap-1.5 rounded-lg h-8 px-3 text-xs font-medium transition-all",
        active
          ? "premium-btn border-0 shadow-md"
          : "bg-transparent border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
      )}
    >
      {active && (
        <motion.div
          layoutId="activeFilter"
          className="absolute inset-0 premium-btn rounded-lg shadow-none hover:shadow-none"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}
      <span className="relative flex items-center gap-1.5">
        {icon}
        {label}
        {count !== undefined && (
          <span
            className={cn(
              "ml-0.5 text-[10px]",
              active ? "opacity-70" : "text-muted-foreground/60"
            )}
          >
            {count}
          </span>
        )}
      </span>
    </Button>
  );
}
