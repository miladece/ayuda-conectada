import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";

const Solicitudes = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Solicitudes Activas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <ItemCard key={index} {...item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Solicitudes;