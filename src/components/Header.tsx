import { Button } from "./ui/button";
import { ShoppingBag, MessageSquare, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ayuda DANA Valencia
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conectando a los afectados por las inundaciones con recursos esenciales. 
            Juntos podemos ayudar a reconstruir nuestra comunidad.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => navigate("/ofertas")}
            className="flex items-center gap-2"
            size="lg"
          >
            <ShoppingBag className="w-5 h-5" />
            Ver Ofertas
          </Button>
          
          <Button
            onClick={() => navigate("/solicitudes")}
            className="flex items-center gap-2"
            size="lg"
          >
            <MessageSquare className="w-5 h-5" />
            Ver Solicitudes
          </Button>
          
          <Button
            onClick={() => navigate("/publicar")}
            className="flex items-center gap-2"
            size="lg"
          >
            <Upload className="w-5 h-5" />
            Publicar
          </Button>
        </div>
      </div>
    </header>
  );
};