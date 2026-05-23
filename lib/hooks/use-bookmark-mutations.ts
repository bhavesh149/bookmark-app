"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBookmark,
  deleteBookmark,
  toggleFavorite,
  updateBookmarkTags,
} from "@/app/actions/bookmarks";
import type { Bookmark, BookmarkFormData } from "@/types/bookmark";
import { toast } from "sonner";

export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: BookmarkFormData) => {
      const result = await createBookmark(formData);
      if (result.error) throw new Error(result.error);
      return result.data as Bookmark;
    },
    onMutate: async (newBookmarkData) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const previousBookmarks = queryClient.getQueryData<Bookmark[]>(["bookmarks"]);

      // Construct optimistic bookmark
      const optimisticId = crypto.randomUUID();
      let faviconUrl = null;
      try {
        const url = newBookmarkData.url.startsWith("http")
          ? newBookmarkData.url
          : `https://${newBookmarkData.url}`;
        const urlObj = new URL(url);
        faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
      } catch {}

      const optimisticBookmark: Bookmark = {
        id: optimisticId,
        user_id: "",
        title: newBookmarkData.title || newBookmarkData.url,
        url: newBookmarkData.url.startsWith("http") ? newBookmarkData.url : `https://${newBookmarkData.url}`,
        favicon_url: faviconUrl,
        image_url: newBookmarkData.image_url || null,
        favorite: newBookmarkData.favorite || false,
        tags: newBookmarkData.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData<Bookmark[]>(["bookmarks"], (old) => {
        return old ? [optimisticBookmark, ...old] : [optimisticBookmark];
      });

      return { previousBookmarks };
    },
    onError: (err, newBookmark, context) => {
      queryClient.setQueryData(["bookmarks"], context?.previousBookmarks);
      toast.error(err.message || "Failed to add bookmark");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onSuccess: () => {
      toast.success("Bookmark saved!");
    }
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteBookmark(id);
      if (result.error) throw new Error(result.error);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const previousBookmarks = queryClient.getQueryData<Bookmark[]>(["bookmarks"]);

      queryClient.setQueryData<Bookmark[]>(["bookmarks"], (old) => {
        return old ? old.filter((b) => b.id !== id) : [];
      });

      return { previousBookmarks };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["bookmarks"], context?.previousBookmarks);
      toast.error(err.message || "Failed to delete bookmark");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onSuccess: () => {
      toast.success("Bookmark deleted");
    }
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      const result = await toggleFavorite(id, isFavorite);
      if (result.error) throw new Error(result.error);
      return { id, isFavorite };
    },
    onMutate: async ({ id, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const previousBookmarks = queryClient.getQueryData<Bookmark[]>(["bookmarks"]);

      queryClient.setQueryData<Bookmark[]>(["bookmarks"], (old) => {
        return old
          ? old.map((b) => (b.id === id ? { ...b, favorite: isFavorite } : b))
          : [];
      });

      return { previousBookmarks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["bookmarks"], context?.previousBookmarks);
      toast.error(err.message || "Failed to update favorite status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useUpdateTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, tags }: { id: string; tags: string[] }) => {
      const result = await updateBookmarkTags(id, tags);
      if (result.error) throw new Error(result.error);
      return { id, tags };
    },
    onMutate: async ({ id, tags }) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const previousBookmarks = queryClient.getQueryData<Bookmark[]>(["bookmarks"]);

      queryClient.setQueryData<Bookmark[]>(["bookmarks"], (old) => {
        return old ? old.map((b) => (b.id === id ? { ...b, tags } : b)) : [];
      });

      return { previousBookmarks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["bookmarks"], context?.previousBookmarks);
      toast.error(err.message || "Failed to update tags");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}
