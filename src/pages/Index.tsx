import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Index = () => {
  const categories = [
    { id: "vehiculos", label: "Vehículos", icon: "🚗" },
    { id: "electrodomesticos", label: "Electrodomésticos", icon: "🏠" },
    { id: "muebles", label: "Muebles", icon: "🪑" },
    { id: "electronica", label: "Electrónica", icon: "📱" },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Example items - in a real app, these would come from an API
  const items = [
    {
      type: "oferta" as const,
      category: "Vehículos",
      title: "Coche familiar",
      location: "Valencia Centro",
      description: "Vehículo en buen estado disponible para familia afectada.",
      contact: "654321987",
      image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
    },
    {
      type: "solicitud" as const,
      category: "Electrodomésticos",
      title: "Necesito nevera",
      location: "Nazaret",
      description: "Familia afectada por la DANA necesita nevera urgentemente.",
      contact: "678912345",
      image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30",
    },
    {
      type: "oferta" as const,
      category: "Muebles",
      title: "Sofá en buen estado",
      location: "Ruzafa",
      description: "Sofá de 3 plazas disponible para quien lo necesite.",
      contact: "666555444",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    },
  ];

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Categories section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Categorías</h2>
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

        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <ItemCard key={index} {...item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;