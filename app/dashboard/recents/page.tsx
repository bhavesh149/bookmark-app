import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookmarkDashboard } from "@/components/bookmarks/bookmark-dashboard";
import type { Bookmark } from "@/types/bookmark";

export default async function RecentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch only the 20 most recent bookmarks
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          Recently Added
        </h1>
        <p className="text-muted-foreground text-sm">
          Your 20 most recently saved bookmarks.
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
