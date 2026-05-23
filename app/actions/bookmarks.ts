"use server";

import { createClient } from "@/lib/supabase/server";
import { bookmarkSchema } from "@/lib/validations/bookmark";
import { revalidatePath } from "next/cache";

export async function createBookmark(formData: {
  title: string;
  url: string;
  tags?: string[];
  image_url?: string;
  favorite?: boolean;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const parsed = bookmarkSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Extract favicon from URL
  let faviconUrl: string | null = null;
  try {
    const urlObj = new URL(parsed.data.url);
    faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
  } catch {
    // Favicon extraction failed, continue without it
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      url: parsed.data.url,
      favicon_url: formData.image_url || faviconUrl,
      tags: parsed.data.tags || [],
      favorite: formData.favorite || false,
    })
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
    return { error: "Failed to create bookmark" };
  }

  revalidatePath("/dashboard");
  return { data };
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    return { error: "Failed to delete bookmark" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleFavorite(id: string, favorite: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("bookmarks")
    .update({ favorite })
    .eq("id", id);

  if (error) {
    console.error("Toggle favorite error:", error);
    return { error: "Failed to update bookmark" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateBookmarkTags(id: string, tags: string[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("bookmarks")
    .update({ tags })
    .eq("id", id);

  if (error) {
    console.error("Update tags error:", error);
    return { error: "Failed to update tags" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function fetchMetadata(url: string) {
  try {
    const targetUrl = url.startsWith("http") ? url : `https://${url}`;
    const response = await fetch(targetUrl, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) 
                    || html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);
    return { 
      title: titleMatch ? titleMatch[1].trim() : "",
      image: imageMatch ? imageMatch[1].trim() : ""
    };
  } catch (error) {
    return { title: "", image: "" };
  }
}
