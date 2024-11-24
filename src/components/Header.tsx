import { Button } from "./ui/button";
import { ShoppingBag, MessageSquare, Upload, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user in header:", user);
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user);
      setUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-4 text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            <img 
              src="/valencia-flag.svg" 
              alt="Valencia Flag" 
              className="w-16 h-10" 
              style={{ objectFit: 'cover' }}
            />
            Ayuda DANA Valencia
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Hola, {user.email}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Registrarse
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 max-w-2xl mx-auto text-center mb-8">
          Conectando a los afectados por las inundaciones con recursos esenciales. 
          Juntos podemos ayudar a reconstruir nuestra comunidad.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => navigate("/ofertas")}
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]"
            size="lg"
          >
            <ShoppingBag className="w-5 h-5" />
            Ver Ofertas
          </Button>
          
          <Button
            onClick={() => navigate("/solicitudes")}
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]"
            size="lg"
          >
            <MessageSquare className="w-5 h-5" />
            Ver Solicitudes
          </Button>

          <Button
            onClick={() => navigate("/donaciones")}
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]"
            size="lg"
          >
            <Upload className="w-5 h-5" />
            Ver Donaciones
          </Button>
          
          <Button
            onClick={() => navigate("/publicar")}
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]"
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