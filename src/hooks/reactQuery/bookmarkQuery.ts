import { axiosClient } from "@/lib/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ===============================|| SHOW URL INFO ||============================== //
const useUrlInfo = () => {
  const queryClient = useQueryClient();
  const urlInfoMutation = useMutation({
    mutationFn: async (data: { url: string }) => {
      return await axiosClient.post("/url", data);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["queryCacheKeys.category"] });
    },
  });
  return { urlInfoMutation };
};

export { useUrlInfo };
