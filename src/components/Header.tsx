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
        console.log("Checking admin status for:", userId);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          console.error("Admin check error:", error);
          throw error;
        }
        
        if (mounted) {
          console.log("Setting admin status:", profile?.is_admin);
          setIsAdmin(!!profile?.is_admin);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (mounted) {
          setIsAdmin(false);
        }
      }
    };

    const initializeAuth = async () => {
      if (!mounted) return;

      try {
        console.log("Initializing auth...");
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Auth initialization error:", error);
          throw error;
        }

        if (mounted) {
          console.log("Setting initial user:", user?.id);
          setUser(user);
          
          if (user) {
            await checkAdminStatus(user.id);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initialize auth state
    console.log("Starting auth initialization");
    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("Auth state changed:", { event, userId: session?.user?.id });
      
      setIsLoading(true);
      
      if (session?.user) {
        setUser(session.user);
        await checkAdminStatus(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      console.log("Cleaning up auth subscriptions");
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