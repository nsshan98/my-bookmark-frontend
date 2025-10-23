import { axiosClient } from "@/lib/axios-client";
import { useQuery } from "@tanstack/react-query";

// ===============================|| USER PROFILE ||============================== //
const useShowUserProfile = () => {
  const showUserProfileQuery = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/user/profile/");
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
  return { showUserProfileQuery };
};

export { useShowUserProfile };
