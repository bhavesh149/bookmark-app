"use client";

import type { Bookmark } from "@/types/bookmark";
import { Star, Trash2, Edit3, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
  index: number;
}

export function BookmarkCard({
  bookmark,
  onDelete,
  onToggleFavorite,
  index,
}: BookmarkCardProps) {
  let hostname = "";
  try {
    hostname = new URL(bookmark.url).hostname.replace("www.", "");
  } catch {
    hostname = bookmark.url;
  }

  // Consistent color block based on title
  const gradientIndex = (bookmark.title.length + hostname.length) % 4;
  const gradients = [
    "from-indigo-500/20 to-purple-500/20",
    "from-blue-500/20 to-cyan-500/20",
    "from-emerald-500/20 to-teal-500/20",
    "from-rose-500/20 to-pink-500/20"
  ];
  const bgGradient = gradients[gradientIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group glass-card rounded-2xl p-4 flex flex-col h-[280px] relative overflow-hidden block"
      >
        {/* Gradient glow effect on hover */}
        <div className="absolute -inset-full bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 group-hover:inset-0 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 z-0"></div>
        
        {/* Placeholder Cover */}
        <div className={`h-32 w-full rounded-xl bg-gradient-to-br ${bgGradient} border border-border/10 mb-4 relative overflow-hidden flex-shrink-0 z-10 flex items-center justify-center`}>
          {bookmark.favicon_url ? (
            <img 
              src={bookmark.favicon_url} 
              alt="Cover" 
              className={
                bookmark.favicon_url.includes("google.com/s2/favicons")
                  ? "w-12 h-12 rounded-lg shadow-sm drop-shadow-md bg-white p-1"
                  : "w-full h-full object-cover"
              }
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <ExternalLink className="w-10 h-10 text-muted-foreground/50" />
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-2 z-10">
          <img src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`} alt="Favicon" className="w-4 h-4 rounded bg-white/10" />
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest truncate">{hostname}</span>
        </div>
        
        <h3 className="text-base font-bold text-foreground leading-tight mb-2 z-10 line-clamp-2">
          {bookmark.title || hostname}
        </h3>
        
        <div className="mt-auto flex items-center justify-between z-10">
          <div className="flex gap-1 overflow-hidden max-w-[70%]">
            {(bookmark.tags || []).slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 rounded bg-accent text-[10px] font-medium text-muted-foreground truncate">
                {tag}
              </span>
            ))}
            {(bookmark.tags || []).length > 3 && (
              <span className="px-2 py-1 rounded bg-accent text-[10px] font-medium text-muted-foreground">
                +{(bookmark.tags || []).length - 3}
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
            {new Date(bookmark.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Hover Actions */}
        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20" onClick={(e) => e.preventDefault()}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(bookmark.id, bookmark.favorite);
            }}
            className="p-2 rounded-xl bg-background/60 backdrop-blur-md text-foreground hover:bg-background transition-all border border-border/20 shadow-sm"
          >
            <Star className={`w-4 h-4 ${bookmark.favorite ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onDelete(bookmark.id);
            }}
            className="p-2 rounded-xl bg-background/60 backdrop-blur-md text-foreground hover:bg-destructive hover:text-destructive-foreground transition-all border border-border/20 shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Always show favorite star if favorited */}
        {bookmark.favorite && (
          <div className="absolute top-6 right-6 z-10 group-hover:opacity-0 transition-opacity">
            <div className="p-2 rounded-xl bg-background/40 backdrop-blur-sm border border-border/10">
               <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
        )}
      </a>
    </motion.div>
  );
}
