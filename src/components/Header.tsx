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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user in header:", user);
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();
        
        console.log("User admin status:", profile?.is_admin);
        setIsAdmin(profile?.is_admin || false);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user);
      setUser(session?.user);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', session.user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            Ayuda DANA Valencia
          </Link>
          <UserMenu user={user} isAdmin={isAdmin} />
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