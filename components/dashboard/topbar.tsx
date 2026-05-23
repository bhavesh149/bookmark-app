"use client";

import { useEffect, useRef, useState } from "react";
import { Search, RefreshCw, Share2, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onMenuClick?: () => void;
}

export function Topbar({ onSearch, searchQuery, onMenuClick }: TopbarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debounceTimerRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      onSearch(value);
    }, 400);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 h-16 flex items-center justify-between px-4 md:px-8 bg-background/80 backdrop-blur-xl z-30 border-b border-border/40 gap-4">
      <div className="flex items-center flex-1 gap-2 min-w-0">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all lg:hidden shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="relative w-full max-w-xl group min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors shrink-0" />
        <input
          ref={searchInputRef}
          type="text"
          value={localQuery}
          onChange={handleChange}
          className="w-full bg-accent/50 border-none rounded-xl pl-10 pr-4 sm:pr-12 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring transition-all outline-none min-w-0"
          placeholder="Search..."
        />
        <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 gap-1 pointer-events-none">
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono text-muted-foreground font-semibold shadow-sm">
            ⌘
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono text-muted-foreground font-semibold shadow-sm">
            K
          </kbd>
        </div>
      </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all relative">
          <RefreshCw className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border border-background"></span>
        </button>
        
        <div className="h-6 w-px bg-border mx-2"></div>
        
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/50 border border-border text-foreground font-semibold text-sm hover:bg-accent transition-all">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        
        <ThemeToggle />
      </div>
    </header>
  );
}
