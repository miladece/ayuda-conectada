import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: any;
  isAdmin: boolean;
}

export const UserMenu = ({ user, isAdmin }: UserMenuProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </Button>
        <Button onClick={() => navigate('/signup')}>
          Registrarse
        </Button>
      </div>
    );
  }

  return (
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
          {isAdmin && (
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              Admin Panel
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleLogout}>
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};