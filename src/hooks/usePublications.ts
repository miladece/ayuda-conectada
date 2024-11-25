import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const usePublications = (selectedCategory: string | null, authChecked: boolean) => {
  return useQuery({
    queryKey: ['publications', selectedCategory, authChecked],
    queryFn: async () => {
      console.log("=== Starting Publications Fetch ===");
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current auth state:", {
          hasSession: !!session,
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });

        let query = supabase
          .from('publications')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        
        console.log("Query results:", {
          success: true,
          count: data?.length || 0,
          hasData: !!data,
          timestamp: new Date().toISOString()
        });

        return data || [];
      } catch (error) {
        console.error("Error fetching publications:", error);
        throw error;
      }
    },
    enabled: authChecked,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    retry: 2
  });
};