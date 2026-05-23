"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  bookmarkTitle: string;
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  bookmarkTitle,
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={() => !isDeleting && onOpenChange(false)}
      />
      
      {/* Premium Modal Panel */}
      <div className="relative modal-glass w-full max-w-md max-h-[100%] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-border/10 text-foreground animate-in zoom-in-95 duration-500">
        
        {/* Modal Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-destructive flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Delete Bookmark
            </h1>
            <button 
              onClick={() => !isDeleting && onOpenChange(false)}
              disabled={isDeleting}
              className="p-2 -mr-2 rounded-full hover:bg-accent transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-8 pb-8">
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              &ldquo;{bookmarkTitle}&rdquo;
            </span>
            ? This action cannot be undone.
          </p>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
              className="px-6 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm font-bold px-8 py-2.5 rounded-xl shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
