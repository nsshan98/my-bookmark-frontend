import { z } from "zod";

export const bookmarksSchema = z.object({
  url: z.url(),
  title: z.string(),
});

export type BookmarksSchemaType = z.infer<typeof bookmarksSchema>;
