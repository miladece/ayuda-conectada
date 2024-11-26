import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserMenu } from "./header/UserMenu";
import { SearchBar } from "./header/SearchBar";
import { NavigationButtons } from "./header/NavigationButtons";

interface HeaderProps {
  hideNavigation?: boolean;
}

export const Header = ({ hideNavigation = false }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async (userId: string) => {
      if (!mounted) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', userId)
          .single();
        
        if (error) throw error;
        
        if (mounted) {
          setIsAdmin(profile?.is_admin || false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (mounted) {
          setIsAdmin(false);
        }
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (mounted) {
          setUser(user);
          if (user) {
            await checkAdminStatus(user.id);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      setIsLoading(true);
      setUser(session?.user);
      
      if (session?.user) {
        await checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            Ayuda DANA Valencia
          </Link>
          <UserMenu user={user} isAdmin={isAdmin} isLoading={isLoading} />
        </div>
        
        {!hideNavigation && (
          <>
            <p className="text-gray-600 max-w-4xl mx-auto text-center mb-8">
              Conectando a los afectados por las inundaciones de la DANA en Valencia con recursos esenciales. 
              Juntos podemos ayudar a reconstruir nuestra comunidad. El poble salva el poble.
            </p>

            <SearchBar />
            <NavigationButtons />
          </>
        )}
      </div>
    </header>
  );
};