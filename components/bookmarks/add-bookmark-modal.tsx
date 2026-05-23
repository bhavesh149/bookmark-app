"use client";

import { useState, useTransition, useEffect } from "react";
import { X, CheckCircle, Plus, Star, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMetadata } from "@/app/actions/bookmarks";
import { useAddBookmark } from "@/lib/hooks/use-bookmark-mutations";
import { toast } from "sonner";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBookmarkModal({ isOpen, onClose }: AddBookmarkModalProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [fetchedTitle, setFetchedTitle] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const addBookmarkMutation = useAddBookmark();

  const isValidUrl = url.length > 5 && url.includes(".");

  // Clear state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setUrl("");
        setTitle("");
        setTags([]);
        setTagInput("");
        setIsFavorite(false);
        setFetchedTitle("");
        setFaviconUrl("");
        setPreviewImage("");
      }, 300);
    }
  }, [isOpen]);

  // Fetch metadata when URL is valid
  useEffect(() => {
    if (isValidUrl) {
      const timer = setTimeout(async () => {
        setIsFetchingMetadata(true);
        try {
          const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
          setFaviconUrl(`https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`);
          
          const meta = await fetchMetadata(url);
          if (meta.title) {
            setFetchedTitle(meta.title);
          }
          if (meta.image) {
            setPreviewImage(meta.image);
          }
        } catch (e) {
          // ignore
        } finally {
          setIsFetchingMetadata(false);
        }
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setFetchedTitle("");
      setFaviconUrl("");
      setPreviewImage("");
    }
  }, [url, isValidUrl]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = () => {
    if (!isValidUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    const finalTags = [...tags];
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      finalTags.push(tagInput.trim());
    }

    addBookmarkMutation.mutate(
      {
        url,
        title: title || fetchedTitle || "",
        tags: finalTags,
        image_url: previewImage || "",
        favorite: isFavorite,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Premium Modal Panel */}
      <div className="relative modal-glass w-full max-w-2xl max-h-[100%] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-border/10 text-foreground animate-in zoom-in-95 duration-500">
        
        {/* Modal Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Add New Bookmark</h1>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-muted-foreground text-sm">Organize your findings with a simple click.</p>
        </div>

        <div className="px-5 md:px-8 pb-6 md:pb-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 overflow-y-auto">
          {/* Form Side */}
          <div className="md:col-span-7 space-y-6">
            
            {/* URL Field */}
            <div className="space-y-2">
              <label className="text-[13px] uppercase text-muted-foreground tracking-widest font-semibold">Target URL</label>
              <div className="relative group">
                <input 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-accent/20 border border-border/20 rounded-xl px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/50 input-gradient-focus border-2 transition-all" 
                  placeholder="https://example.com" 
                  type="url"
                  autoFocus
                />
                {isValidUrl && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-emerald-500">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] uppercase text-muted-foreground tracking-widest font-semibold">Custom Title</label>
                {fetchedTitle && (
                  <button 
                    onClick={() => setTitle(fetchedTitle)}
                    className="text-xs text-primary hover:underline"
                  >
                    Use fetched title
                  </button>
                )}
              </div>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-accent/20 border border-border/20 rounded-xl px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-ring focus:border-ring transition-all outline-none" 
                placeholder={fetchedTitle ? `e.g. ${fetchedTitle}` : "Enter a recognizable title (optional)..."} 
                type="text"
              />
            </div>

            {/* Tags Selector */}
            <div className="space-y-2">
              <label className="text-[13px] uppercase text-muted-foreground tracking-widest font-semibold">Categorize (Press Enter)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full bg-accent/20 border border-border/20 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-ring transition-all outline-none" 
                  placeholder="Add tags..." 
                  type="text"
                />
                <select 
                  onChange={(e) => {
                    if (e.target.value && !tags.includes(e.target.value)) {
                      setTags([...tags, e.target.value]);
                    }
                    e.target.value = "";
                  }}
                  className="bg-accent/20 border border-border/20 rounded-xl px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring transition-all outline-none"
                >
                  <option value="">Presets...</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Inspiration">Inspiration</option>
                  <option value="Tools">Tools</option>
                  <option value="Articles">Articles</option>
                </select>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map(tag => (
                    <span key={tag} className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite Toggle */}
            <div className="flex items-center justify-between p-4 bg-accent/20 rounded-2xl border border-border/10">
              <div className="flex items-center gap-3">
                <Star className={cn("w-5 h-5", isFavorite ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
                <div>
                  <p className="text-sm font-semibold text-foreground">Mark as Favorite</p>
                  <p className="text-xs text-muted-foreground">Pin this to your dashboard top row.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only toggle-checkbox" 
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                />
                <div className={cn("w-11 h-6 rounded-full transition-colors duration-300", isFavorite ? "bg-primary" : "bg-muted")}>
                  <div className={cn("absolute top-1 left-1 bg-background w-4 h-4 rounded-full transition-transform duration-300", isFavorite && "transform translate-x-5")}></div>
                </div>
              </label>
            </div>

          </div>

          {/* Preview Side */}
          <div className="md:col-span-5 flex flex-col">
            <label className="text-[13px] uppercase text-muted-foreground tracking-widest font-semibold mb-4">Live Preview</label>
            <div className="relative group h-full">
              
              {!isValidUrl ? (
                /* Empty State Static */
                <div className="h-full min-h-[280px] rounded-2xl border border-dashed border-border/40 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-accent/5">
                  <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-muted-foreground/50">
                    <Globe className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">No URL provided</p>
                    <p className="text-xs text-muted-foreground italic pt-1 max-w-[200px] mx-auto">Start typing a valid URL to see a live visual preview...</p>
                  </div>
                </div>
              ) : (
                /* Active State Preview */
                <div className="h-full rounded-2xl border border-border/20 bg-accent/10 overflow-hidden shadow-xl ring-1 ring-border/30 flex flex-col">
                  <div className="relative h-40 bg-muted/30 flex flex-col items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img src={previewImage} alt="Site Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : faviconUrl ? (
                      <img src={faviconUrl} alt="Favicon" className="w-16 h-16 rounded-xl shadow-lg mb-2 relative z-10" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-accent/20 animate-pulse mb-2 relative z-10"></div>
                    )}
                    
                    {!previewImage && (
                      <span className="text-muted-foreground italic text-sm relative z-10">
                        {isFetchingMetadata ? "Fetching details..." : "Preview Ready"}
                      </span>
                    )}
                    {previewImage && <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>}
                  </div>
                  <div className="p-4 space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground/80 uppercase tracking-widest truncate">
                        {new URL(url.startsWith('http') ? url : `https://${url}`).hostname}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold leading-tight text-foreground line-clamp-2">
                      {title || fetchedTitle || url}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-accent/5 border-t border-border/10 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          >
            Cancel
          </button>
          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              disabled={addBookmarkMutation.isPending || !isValidUrl}
              className="bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-bold px-8 py-2.5 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addBookmarkMutation.isPending ? "Saving..." : "Save Bookmark"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
