"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AddBookmarkModal } from "@/components/bookmarks/add-bookmark-modal";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface LayoutShellProps {
  user: {
    id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
  };
  children: React.ReactNode;
}

export function DashboardLayoutShell({ user, children }: LayoutShellProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const handleOpen = () => setIsAddModalOpen(true);
    document.addEventListener('open-add-modal', handleOpen);
    return () => document.removeEventListener('open-add-modal', handleOpen);
  }, []);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Sidebar 
        user={user} 
        onAddClick={() => setIsAddModalOpen(true)} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className="lg:ml-[260px] h-screen overflow-y-auto bg-background">
        <Topbar 
          searchQuery={searchQuery} 
          onSearch={handleSearch} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </div>
      </main>

      <AddBookmarkModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
