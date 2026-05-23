import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookmarkDashboard } from "@/components/bookmarks/bookmark-dashboard";
import type { Bookmark } from "@/types/bookmark";

export default async function FavoritesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch only the favorite bookmarks
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("favorite", true)
    .order("created_at", { ascending: false });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          Favorites
        </h1>
        <p className="text-muted-foreground text-sm">
          Your pinned and favorite bookmarks.
        </p>
      </div>
      <BookmarkDashboard
        initialBookmarks={(bookmarks as Bookmark[]) || []}
        user={{
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          avatar_url: user.user_metadata?.avatar_url,
        }}
        hideHeader={true}
      />
    </div>
  );
}
