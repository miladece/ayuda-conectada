import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useAdminPublications = (isAdmin: boolean) => {
  return useQuery({
    queryKey: ['adminPublications'],
    queryFn: async () => {
      console.log("Starting publications fetch...");
      
      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching publications:", error);
          throw error;
        }
        
        console.log("Publications fetch successful:", {
          count: data?.length || 0,
          timestamp: new Date().toISOString()
        });
        
        return data || [];
      } catch (error) {
        console.error("Fatal error in publications fetch:", error);
        throw error;
      }
    },
    enabled: isAdmin,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};