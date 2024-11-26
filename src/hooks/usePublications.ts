import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const usePublications = (selectedCategory: string | null, authChecked: boolean) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['publications', selectedCategory, authChecked],
    queryFn: async () => {
      console.log("=== Starting Publications Fetch ===", {
        browser: navigator.userAgent,
        timestamp: new Date().toISOString(),
        selectedCategory,
        authChecked
      });
      
      try {
        // First check Supabase connection
        const { data: healthCheck, error: healthError } = await supabase
          .from('publications')
          .select('count(*)', { count: 'exact', head: true });

        if (healthError) {
          console.error("Supabase health check failed:", {
            error: healthError,
            browser: navigator.userAgent,
            timestamp: new Date().toISOString()
          });
          throw healthError;
        }

        console.log("Supabase connection healthy:", {
          count: healthCheck.count,
          timestamp: new Date().toISOString()
        });

        // Now fetch the actual data
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
            browser: navigator.userAgent,
            timestamp: new Date().toISOString()
          });
          throw error;
        }
        
        console.log("Publications query successful:", {
          count: data?.length || 0,
          hasData: !!data,
          timestamp: new Date().toISOString(),
          browser: navigator.userAgent
        });

        if (!data || data.length === 0) {
          console.log("No publications found:", {
            selectedCategory,
            timestamp: new Date().toISOString()
          });
        }

        return data || [];
      } catch (error: any) {
        console.error("Fatal error in publications fetch:", {
          error,
          message: error.message,
          browser: navigator.userAgent,
          timestamp: new Date().toISOString()
        });

        // Show a toast for connection errors
        toast({
          title: "Error de conexión",
          description: "No se pudieron cargar las publicaciones. Por favor, intenta recargar la página.",
          variant: "destructive",
        });

        throw error;
      }
    },
    enabled: authChecked,
    staleTime: 1000 * 30, // Reduced to 30 seconds to help with Chrome issues
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