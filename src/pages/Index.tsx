import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
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

  const fetchPublications = async () => {
    console.log("Starting fetchPublications:", {
      timestamp: new Date().toISOString(),
      browser: navigator.userAgent,
      selectedCategory
    });

    try {
      let query = supabase
        .from('publications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      console.log("Executing Supabase query:", {
        timestamp: new Date().toISOString(),
        queryDetails: query.toSQL ? query.toSQL() : 'Query details not available'
      });

      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase query error:", {
          error,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
      
      console.log("Publications fetched successfully:", {
        count: data?.length || 0,
        firstItem: data?.[0],
        timestamp: new Date().toISOString()
      });

      return data;
    } catch (error) {
      console.error("Error in fetchPublications:", {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  };

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['publications', selectedCategory],
    queryFn: fetchPublications,
    retry: 2,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

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

  // Log whenever items change
  console.log("Items state updated:", {
    itemsLength: items?.length || 0,
    isLoading,
    hasError: !!error,
    timestamp: new Date().toISOString()
  });

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