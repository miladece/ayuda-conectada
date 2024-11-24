import { Button } from "./ui/button";
import { ShoppingBag, MessageSquare, Upload, User, Gift, Home, Search } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

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

  useEffect(() => {
    const searchPublications = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(10);

        if (error) throw error;
        
        console.log("Search results:", data);
        setSearchResults(data || []);
      } catch (error) {
        console.error("Error searching publications:", error);
      }
    };

    const debounceTimeout = setTimeout(searchPublications, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
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
        
        <p className="text-gray-600 max-w-4xl mx-auto text-center mb-8">
          Conectando a los afectados por las inundaciones de la DANA en Valencia con recursos esenciales. 
          Juntos podemos ayudar a reconstruir nuestra comunidad. El poble salva el poble.
        </p>

        <div className="relative mb-8">
          <div className="flex items-center max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Buscar publicaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 h-5 w-5 text-gray-400" />
          </div>
          {searchResults.length > 0 && searchQuery && (
            <div className="absolute z-10 w-full max-w-md mx-auto mt-2 bg-white rounded-md shadow-lg border">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => {
                    navigate(`/publication/${result.id}`);
                    setSearchQuery("");
                  }}
                >
                  <h3 className="font-medium">{result.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{result.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]"
            size="lg"
          >
            <Home className="w-5 h-5" />
            Ver Todo
          </Button>

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
            <Gift className="w-5 h-5" />
            Ver Donaciones
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
      </div>
    </header>
  );
};