import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useAdminUsers = (isAdmin: boolean) => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      console.log("Starting users fetch...");
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      console.log("Final profiles data:", profiles);

      return profiles?.map(profile => ({
        user_id: profile.user_id,
        name: profile.name || profile.email,
        email: profile.email,
        banned: profile.banned,
        created_at: profile.created_at
      })) || [];
    },
    enabled: isAdmin,
    staleTime: 0,
    gcTime: 0
  });
};