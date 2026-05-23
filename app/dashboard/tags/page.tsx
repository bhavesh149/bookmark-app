import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Tag } from "lucide-react";

export default async function TagsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("tags");

  // Extract unique tags and count them
  const tagCounts: Record<string, number> = {};
  if (bookmarks) {
    bookmarks.forEach(bookmark => {
      if (bookmark.tags && Array.isArray(bookmark.tags)) {
        bookmark.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
  }

  const uniqueTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          Your Tags
        </h1>
        <p className="text-muted-foreground text-sm">
          Browse your bookmarks by categories.
        </p>
      </div>
      
      {uniqueTags.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No tags yet</h3>
          <p className="text-sm text-muted-foreground">Add tags to your bookmarks to organize them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uniqueTags.map(([tag, count]) => (
            <Link href={`/dashboard?q=${encodeURIComponent(tag)}`} key={tag}>
              <div className="glass-card p-6 rounded-2xl hover:bg-accent/10 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer border border-border/10">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground truncate w-full px-2">{tag}</h3>
                <p className="text-xs text-muted-foreground mt-1">{count} bookmark{count !== 1 ? 's' : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
