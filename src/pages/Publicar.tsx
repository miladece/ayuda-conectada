import { Header } from "@/components/Header";
import { PublicationForm } from "@/components/PublicationForm";

const Publicar = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Publicar Anuncio</h2>
        <PublicationForm />
      </main>
    </div>
  );
};

export default Publicar;