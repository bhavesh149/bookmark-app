"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Bookmark, Star, Tag, Clock, Settings, HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "@/components/auth/logout-button";

interface SidebarProps {
  user: {
    id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
  };
  onAddClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ user, onAddClick, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  // handleLogout moved to LogoutButton

  const displayName = user.name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-[260px] bg-sidebar border-r border-sidebar-border flex flex-col py-8 px-4 z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
          L
        </div>
        <span className="font-bold text-xl text-sidebar-foreground tracking-tight">
          Linkora
        </span>
      </div>

      <button
        onClick={onAddClick}
        className="mx-4 mb-8 py-3 px-4 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        New Bookmark
      </button>

      <nav className="flex-1 space-y-1">
        <NavLink
          href="/dashboard"
          icon={<Bookmark className="w-5 h-5" />}
          label="Library"
          active={pathname === "/dashboard"}
        />
        <NavLink
          href="/dashboard/favorites"
          icon={<Star className="w-5 h-5" />}
          label="Favorites"
          active={pathname === "/dashboard/favorites"}
        />
        <NavLink
          href="/dashboard/tags"
          icon={<Tag className="w-5 h-5" />}
          label="Tags"
          active={pathname === "/dashboard/tags"}
        />
        <NavLink
          href="/dashboard/recents"
          icon={<Clock className="w-5 h-5" />}
          label="Recents"
          active={pathname === "/dashboard/recents"}
        />
      </nav>

      <div className="mt-auto space-y-1">
        <NavLink
          href="/dashboard/settings"
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
          active={pathname === "/dashboard/settings"}
        />
        <NavLink
          href="/dashboard/support"
          icon={<HelpCircle className="w-5 h-5" />}
          label="Support"
          active={pathname === "/dashboard/support"}
        />

        <div className="pt-6 mt-6 border-t border-sidebar-border px-4 flex items-center justify-between group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                Pro Plan
              </p>
            </div>
          </div>
          <LogoutButton iconOnly />
        </div>
      </div>
    </aside>
    </>
  );
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold transition-colors group",
        active
          ? "nav-item-active bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-sidebar-foreground hover:bg-accent/50"
      )}
    >
      <span className={cn("transition-colors", active ? "text-accent-foreground" : "group-hover:text-sidebar-foreground")}>
        {icon}
      </span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}
