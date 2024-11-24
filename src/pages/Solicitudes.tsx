import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Solicitudes = () => {
  const categories = [
    { id: "vehiculos", label: "Vehículos", icon: "🚗" },
    { id: "electrodomesticos", label: "Electrodomésticos", icon: "🏠" },
    { id: "muebles", label: "Muebles", icon: "🪑" },
    { id: "electronica", label: "Electrónica", icon: "📱" },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Example requests - in a real app, these would come from an API
  const items = [
    {
      type: "solicitud" as const,
      category: "Electrodomésticos",
      title: "Necesito nevera",
      location: "Nazaret",
      description: "Familia afectada por la DANA necesita nevera urgentemente.",
      contact: "678912345",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    },
    {
      type: "solicitud" as const,
      category: "Muebles",
      title: "Necesito camas",
      location: "Valencia Centro",
      description: "Necesitamos 2 camas individuales para niños.",
      contact: "654321987",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    },
  ];

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Solicitudes Activas</h2>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.label ? "default" : "outline"}
                className="text-lg py-2 px-4 cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={() => 
                  setSelectedCategory(
                    selectedCategory === category.label ? null : category.label
                  )
                }
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <ItemCard key={index} {...item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Solicitudes;