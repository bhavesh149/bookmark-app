import { z } from "zod";

/**
 * Normalizes a URL by prepending https:// if no protocol is present.
 */
function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export const bookmarkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters")
    .trim(),
  url: z
    .string()
    .min(1, "URL is required")
    .transform(normalizeUrl)
    .pipe(z.string().url("Please enter a valid URL")),
  tags: z
    .array(z.string().trim())
    .transform((tags) => tags.filter((t) => t.length > 0)),
});

// Input type (what the form fields provide before validation/transforms)
export type BookmarkFormInput = {
  title: string;
  url: string;
  tags: string[];
};

// Output type (after validation/transforms are applied)
export type BookmarkFormValues = z.infer<typeof bookmarkSchema>;
