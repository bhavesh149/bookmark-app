export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  favicon_url: string | null;
  image_url: string | null;
  favorite: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BookmarkFormData {
  title: string;
  url: string;
  image_url?: string;
  favorite?: boolean;
  tags?: string[];
}

export type FilterType = "all" | "favorites" | string; // string for tag-based filters
