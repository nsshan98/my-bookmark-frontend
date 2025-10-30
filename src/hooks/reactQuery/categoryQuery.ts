import { axiosClient } from "@/lib/axios-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ===============================|| SHOW ALL CATEGORY ||============================== //
const useShowCategory = () => {
  const showCategoryQuery = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/category/all-categories/");
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
  return { showCategoryQuery };
};

// ===============================|| CREATE NEW CATEGORY ||============================== //
const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const categoryCreateMutation = useMutation({
    mutationFn: async (data: { category_name: string }) => {
      return await axiosClient.post("/category/create/", data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
    },
  });
  return { categoryCreateMutation };
};

// ===============================|| EDIT CATEGORY ||============================== //
const useEditCategory = () => {
  const queryClient = useQueryClient();
  const categoryEditMutation = useMutation({
    mutationFn: async ({
      categoryId,
      category_name,
    }: {
      categoryId: string;
      category_name: string;
    }) => {
      return await axiosClient.patch(`/category/update/${categoryId}`, {
        category_name,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
    },
  });
  return { categoryEditMutation };
};

// ===============================|| DELETE CATEGORY ||============================== //
const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const categoryDeleteMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      return await axiosClient.delete(`/category/delete/${categoryId}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["category"],
      });
    },
  });
  return { categoryDeleteMutation };
};

export {
  useShowCategory,
  useCreateCategory,
  useEditCategory,
  useDeleteCategory,
};
