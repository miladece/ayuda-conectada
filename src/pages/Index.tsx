import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";

const Index = () => {
  // Example items - in a real app, these would come from an API
  const items = [
    {
      type: "oferta" as const,
      category: "Muebles",
      title: "Sofá en buen estado",
      location: "Valencia Centro",
      description: "Sofá de 3 plazas en buen estado. Disponible para recoger.",
      contact: "654321987",
    },
    {
      type: "solicitud" as const,
      category: "Electrodomésticos",
      title: "Necesito nevera",
      location: "Nazaret",
      description: "Familia afectada por la DANA necesita nevera urgentemente.",
      contact: "678912345",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <ItemCard key={index} {...item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;