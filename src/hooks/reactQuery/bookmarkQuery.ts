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

// ===============================|| SHOW ALL BOOKMARKS BY CATEGORY ||============================== //
const useShowBookmarksWithCategory = () => {
  const showBookmarksWithCategoryQuery = useQuery({
    queryKey: ["bookmarks-with-category"],
    queryFn: async () => {
      const { data } = await axiosClient.get(
        "/bookmark/bookmarks-with-category/"
      );
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
  return { showBookmarksWithCategoryQuery };
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
      queryClient.invalidateQueries({
        queryKey: ["bookmarks-with-category"],
      });
    },
  });
  return { bookmarkCreateMutation };
};

// ===============================|| EDIT BOOKMARK ||============================== //
const useEditBookmark = (bookmarkId: string) => {
  const queryClient = useQueryClient();
  const bookmarkEditMutation = useMutation({
    mutationFn: async (data: BookmarksSchemaType) => {
      return await axiosClient.patch(`/bookmark/update/${bookmarkId}`, data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },
  });
  return { bookmarkEditMutation };
};

// ===============================|| DELETE BOOKMARK ||============================== //
const useDeleteBookmark = () => {
  const queryClient = useQueryClient();
  const bookmarkDeleteMutation = useMutation({
    mutationFn: async (bookmarkId: string) => {
      return await axiosClient.delete(`/bookmark/delete/${bookmarkId}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },
  });
  return { bookmarkDeleteMutation };
};

export {
  useUrlInfo,
  useShowBookmarks,
  useShowBookmarksWithCategory,
  useCreateBookmark,
  useEditBookmark,
  useDeleteBookmark,
};
