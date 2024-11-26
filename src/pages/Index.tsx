import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { usePublications } from "@/hooks/usePublications";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const categories = [
  { id: "vehiculos", label: "Vehículos", icon: "🚗" },
  { id: "electrodomesticos", label: "Electrodomésticos", icon: "🏠" },
  { id: "muebles", label: "Muebles", icon: "🪑" },
  { id: "electronica", label: "Electrónica", icon: "📱" },
];

const Index = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const authChecked = useAuthCheck();
  
  const { data: items = [], isLoading, error } = usePublications(selectedCategory, authChecked);

  if (error) {
    console.error("Query error:", error);
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
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="text-base sm:text-lg py-1.5 sm:py-2 px-3 sm:px-4 cursor-pointer hover:bg-primary/90 transition-colors justify-center"
                onClick={() => 
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
              >
                <span className="mr-2">{category.icon}</span>
                <span className="text-sm sm:text-base">{category.label}</span>
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