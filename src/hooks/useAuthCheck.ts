import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useAuthCheck = () => {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial auth check:", {
          hasSession: !!session,
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });
        
        // Small delay to ensure auth is fully initialized
        setTimeout(() => setAuthChecked(true), 100);
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthChecked(true);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change detected:", {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      // Reset authChecked on auth state changes
      setAuthChecked(false);
      setTimeout(() => setAuthChecked(true), 100);
    });

    return () => subscription.unsubscribe();
  }, []);

  return authChecked;
};