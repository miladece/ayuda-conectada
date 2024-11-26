import { Button } from "@/components/ui/button";
import { ShoppingBag, MessageSquare, Upload, Gift, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NavigationButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]"
        size="lg"
      >
        <Home className="w-5 h-5" />
       
      </Button>

      <Button
        onClick={() => navigate("/ofertas")}
        className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]"
        size="lg"
      >
        <ShoppingBag className="w-5 h-5" />
        Ofertas
      </Button>
      
      <Button
        onClick={() => navigate("/solicitudes")}
        className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]"
        size="lg"
      >
        <MessageSquare className="w-5 h-5" />
        Solicitudes
      </Button>

      <Button
        onClick={() => navigate("/donaciones")}
        className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]"
        size="lg"
      >
        <Gift className="w-5 h-5" />
        Donaciones
      </Button>
      
      <Button
        onClick={() => navigate("/publicar")}
        className="flex items-center gap-2 bg-[#FF4F4F] hover:bg-[#E63E3E]"
        size="lg"
      >
        <Upload className="w-5 h-5" />
        Publicar
      </Button>
    </div>
  );
};
