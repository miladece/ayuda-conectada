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
        setAuthChecked(true);
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
    });

    return () => subscription.unsubscribe();
  }, []);

  return authChecked;
};