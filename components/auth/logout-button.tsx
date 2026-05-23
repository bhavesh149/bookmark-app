"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function LogoutButton({ iconOnly }: { iconOnly?: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
      setIsLoggingOut(false);
      setIsOpen(false);
      return;
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {iconOnly ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      )}

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => !isLoggingOut && setIsOpen(false)}
          />
          
          {/* Premium Modal Panel */}
          <div className="relative modal-glass w-full max-w-md max-h-[100%] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-border/10 text-foreground animate-in zoom-in-95 duration-500">
            
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-4">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <LogOut className="h-6 w-6" />
                  Sign Out
                </h1>
                <button 
                  onClick={() => !isLoggingOut && setIsOpen(false)}
                  disabled={isLoggingOut}
                  className="p-2 -mr-2 rounded-full hover:bg-accent transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 pb-8">
              <p className="text-muted-foreground text-sm">
                Do you want to logout?
              </p>

              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isLoggingOut}
                  className="px-6 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="premium-btn text-sm font-bold px-8 py-2.5 rounded-xl shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoggingOut && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
