import { z } from "zod";

export const bookmarksSchema = z.object({
  url: z.url(),
  title: z.string(),
  logo: z.string().optional(),
  image: z.string().optional(),
  category_ids: z.array(z.string()).optional(),
});

export type BookmarksSchemaType = z.infer<typeof bookmarksSchema>;

export type Bookmarks = {
  id: string;
  url: string;
  title: string;
  created_at: Date;
  updatedAt: Date;
  image?: string;
  description?: string;
  category_ids?: string[];
};

export type BookmarksCategory = {
  id: string;
  url: string;
  title: string;
  created_at: Date;
  updatedAt: Date;
  image?: string;
  description?: string;
  category_ids?: string[];
};

export type BookmarksWithCategory = {
  id: string;
  name: string;
  bookmarks: BookmarksCategory[];
};
