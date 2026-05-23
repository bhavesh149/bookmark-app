import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookmarkDashboard } from "@/components/bookmarks/bookmark-dashboard";
import type { Bookmark } from "@/types/bookmark";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch initial bookmarks server-side
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <BookmarkDashboard
      initialBookmarks={(bookmarks as Bookmark[]) || []}
      user={{
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url,
      }}
    />
  );
}
