import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const categories = [
    { id: "vehiculos", label: "Vehículos", icon: "🚗" },
    { id: "electrodomesticos", label: "Electrodomésticos", icon: "🏠" },
    { id: "muebles", label: "Muebles", icon: "🪑" },
    { id: "electronica", label: "Electrónica", icon: "📱" },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        let query = supabase
          .from('publications')
          .select('*');
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        
        console.log("Fetched publications:", data);
        setItems(data || []);
      } catch (error) {
        console.error("Error fetching publications:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las publicaciones.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [selectedCategory, toast]);

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

        {loading ? (
          <p className="text-center text-gray-600">Cargando publicaciones...</p>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
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
          <p className="text-center text-gray-600">No hay publicaciones disponibles</p>
        )}
      </main>
    </div>
  );
};

export default Index;