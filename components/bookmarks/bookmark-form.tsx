"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookmarkSchema, type BookmarkFormInput } from "@/lib/validations/bookmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Link, Type, Tag, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface BookmarkFormProps {
  onSubmit: (data: { title: string; url: string; tags?: string[] }) => Promise<boolean>;
  isLoading: boolean;
}

export function BookmarkForm({ onSubmit, isLoading }: BookmarkFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookmarkFormInput>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      title: "",
      url: "",
      tags: [],
    },
  });

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const onFormSubmit = async (data: BookmarkFormInput) => {
    const success = await onSubmit({
      title: data.title,
      url: data.url,
      tags,
    });
    if (success) {
      reset();
      setTags([]);
      setIsOpen(false);
    }
  };

  return (
    <div>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="gap-2 premium-btn rounded-xl h-11 px-6"
            >
              <Plus className="h-4 w-4" />
              Add Bookmark
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">New Bookmark</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                    setTags([]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("title")}
                    placeholder="Bookmark title"
                    className="pl-10 h-11 rounded-xl bg-background"
                    autoFocus
                  />
                </div>
                {errors.title && (
                  <p className="text-sm text-destructive pl-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* URL Input */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("url")}
                    placeholder="https://example.com"
                    className="pl-10 h-11 rounded-xl bg-background"
                  />
                </div>
                {errors.url && (
                  <p className="text-sm text-destructive pl-1">
                    {errors.url.message}
                  </p>
                )}
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 pl-2.5 pr-1.5 py-1 rounded-lg"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {tags.length < 5 && (
                    <div className="relative flex-1 min-w-[140px]">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        onBlur={addTag}
                        placeholder="Add tag (enter to add)"
                        className="pl-10 h-9 rounded-lg bg-background text-sm"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground pl-1">
                  Up to 5 tags. Press Enter to add.
                </p>
              </div>

              {/* Submit */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 premium-btn rounded-xl h-11"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Bookmark"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                    setTags([]);
                  }}
                  className="rounded-xl h-11"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
