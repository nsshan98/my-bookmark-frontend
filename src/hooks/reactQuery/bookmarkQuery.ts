import { axiosClient } from "@/lib/axios-client";
import { BookmarksSchemaType } from "@/zod/bookmarks-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ===============================|| SHOW URL INFO ||============================== //
const useUrlInfo = () => {
  const queryClient = useQueryClient();
  const urlInfoMutation = useMutation({
    mutationFn: async (data: { url: string }) => {
      return await axiosClient.post("/url", data);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
  return { urlInfoMutation };
};

// ===============================|| SHOW ALL BOOKMARKS ||============================== //

const useShowBookmarks = () => {
  const showBookmarksQuery = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/bookmark/all-bookmarks/");
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
  return { showBookmarksQuery };
};

// ===============================|| CREATE NEW BOOKMARK ||============================== //
const useCreateBookmark = () => {
  const queryClient = useQueryClient();
  const bookmarkCreateMutation = useMutation({
    mutationFn: async (data: BookmarksSchemaType) => {
      return await axiosClient.post("/bookmark/create/", data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },
  });
  return { bookmarkCreateMutation };
};

export { useUrlInfo, useShowBookmarks, useCreateBookmark };
