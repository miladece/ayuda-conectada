import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const usePublications = (selectedCategory: string | null, authChecked: boolean) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['publications', selectedCategory, authChecked],
    queryFn: async () => {
      console.log("=== Starting Publications Fetch ===", {
        selectedCategory,
        authChecked,
        timestamp: new Date().toISOString()
      });
      
      try {
        // Wait for any pending auth operations
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session state:", {
          hasSession: !!session,
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });

        // Check Supabase connection
        const { count, error: healthError } = await supabase
          .from('publications')
          .select('*', { count: 'exact', head: true });

        if (healthError) {
          console.error("Supabase health check failed:", {
            error: healthError,
            timestamp: new Date().toISOString()
          });
          throw healthError;
        }

        console.log("Supabase connection healthy:", {
          count,
          timestamp: new Date().toISOString()
        });

        // Fetch publications
        let query = supabase
          .from('publications')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error("Publications query failed:", {
            error,
            timestamp: new Date().toISOString()
          });
          throw error;
        }
        
        console.log("Publications query successful:", {
          count: data?.length || 0,
          hasData: !!data,
          timestamp: new Date().toISOString()
        });

        return data || [];
      } catch (error: any) {
        console.error("Fatal error in publications fetch:", {
          error,
          message: error.message,
          timestamp: new Date().toISOString()
        });

        toast({
          title: "Error de conexión",
          description: "No se pudieron cargar las publicaciones. Por favor, intenta recargar la página.",
          variant: "destructive",
        });

        throw error;
      }
    },
    enabled: authChecked,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      console.log("Retrying query:", {
        failureCount,
        error,
        timestamp: new Date().toISOString()
      });
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 10000);
      console.log(`Retry delay: ${delay}ms for attempt ${attemptIndex + 1}`);
      return delay;
    }
  });
};