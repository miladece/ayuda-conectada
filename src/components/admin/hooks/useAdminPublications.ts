import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useAdminPublications = (isAdmin: boolean) => {
  return useQuery({
    queryKey: ['adminPublications'],
    queryFn: async () => {
      console.log("Fetching publications data...");
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching publications:", error);
        throw error;
      }
      
      console.log("Fetched publications:", data);
      return data || [];
    },
    enabled: isAdmin,
    staleTime: 0,
    gcTime: 0
  });
};