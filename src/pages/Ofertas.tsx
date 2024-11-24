import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";

const Ofertas = () => {
  // Example offers - in a real app, these would come from an API
  const items = [
    {
      type: "oferta" as const,
      category: "Muebles",
      title: "Sofá en buen estado",
      location: "Valencia Centro",
      description: "Sofá de 3 plazas en buen estado. Disponible para recoger.",
      contact: "654321987",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    },
    {
      type: "oferta" as const,
      category: "Electrodomésticos",
      title: "Lavadora seminueva",
      location: "Nazaret",
      description: "Lavadora de 6 meses de uso. Perfecto estado.",
      contact: "678912345",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Ofertas Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <ItemCard key={index} {...item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Ofertas;