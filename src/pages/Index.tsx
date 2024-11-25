import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const categories = [
    { id: "vehiculos", label: "Vehículos", icon: "🚗" },
    { id: "electrodomesticos", label: "Electrodomésticos", icon: "🏠" },
    { id: "muebles", label: "Muebles", icon: "🪑" },
    { id: "electronica", label: "Electrónica", icon: "📱" },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Add auth state check with detailed logging
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Initial auth check:", {
          hasSession: !!session,
          userId: session?.user?.id,
          error: error?.message,
          timestamp: new Date().toISOString()
        });
        setAuthChecked(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthChecked(true); // Still set to true to allow guest access
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change detected:", {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPublications = async () => {
    console.log("=== Starting Publications Fetch ===");
    console.log("Initial state:", {
      authChecked,
      selectedCategory,
      timestamp: new Date().toISOString()
    });

    try {
      // Check auth state before query
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current auth state:", {
        hasSession: !!session,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });

      // Construct and log query
      let query = supabase
        .from('publications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      console.log("Executing query:", {
        hasCategory: !!selectedCategory,
        category: selectedCategory,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await query;
      
      if (error) {
        console.error("Query error:", {
          error,
          message: error.message,
          code: error.code,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
      
      console.log("Query results:", {
        success: true,
        count: data?.length || 0,
        hasData: !!data,
        firstItemId: data?.[0]?.id,
        timestamp: new Date().toISOString()
      });

      return data || [];
    } catch (error) {
      console.error("Fatal error in fetchPublications:", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  };

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['publications', selectedCategory, authChecked],
    queryFn: fetchPublications,
    retry: 2,
    enabled: authChecked,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  // Log state updates
  useEffect(() => {
    console.log("Items state updated:", {
      itemsLength: items?.length || 0,
      isLoading,
      hasError: !!error,
      timestamp: new Date().toISOString()
    });
  }, [items, isLoading, error]);

  if (error) {
    console.error("Query error:", {
      error,
      timestamp: new Date().toISOString()
    });
    toast({
      title: "Error",
      description: "No se pudieron cargar las publicaciones.",
      variant: "destructive",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Categorías</h2>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="text-lg py-2 px-4 cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={() => 
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Cargando publicaciones...</span>
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
              <ItemCard 
                key={item.id}
                type={item.type}
                category={item.category}
                title={item.title}
                location={item.location}
                description={item.description}
                contact={item.contact}
                image={item.image_url || '/placeholder.svg'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No hay publicaciones disponibles</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;