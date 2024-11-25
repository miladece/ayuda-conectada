import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { UsersList } from "@/components/admin/UsersList";
import { PostsList } from "@/components/admin/PostsList";
import { checkFirstUser, checkAdminStatus } from "@/utils/adminUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch users data
  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      console.log("Starting users fetch...");
      
      // First get all auth users
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.users();
      
      if (authError) {
        console.error("Error fetching auth users:", authError);
        // If we can't get auth users, fall back to profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (profilesError) throw profilesError;
        return profiles;
      }

      console.log("Fetched auth users:", authUsers);

      // For each auth user, ensure they have a profile
      for (const authUser of authUsers) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select()
          .eq('user_id', authUser.id)
          .single();

        if (!existingProfile) {
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: authUser.id,
              name: authUser.email,
              email: authUser.email,
              is_admin: false,
              banned: false
            });

          if (insertError) {
            console.error("Error creating profile for user:", authUser.id, insertError);
          }
        }
      }

      // Now get all profiles after ensuring they exist
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

  const { data: publications = [], refetch: refetchPublications } = useQuery({
    queryKey: ['adminPublications'],
    queryFn: async () => {
      console.log("Fetching publications data...");
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching publications:", error);
        throw error;
      }
      
      console.log("Fetched publications:", data);
      return data || [];
    },
    enabled: isAdmin,
    staleTime: 0,
    gcTime: 0
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Current user:", user);

    if (!user) {
      console.log("No user found, redirecting...");
      toast({
        variant: "destructive",
        title: "Acceso denegado",
        description: "Debes iniciar sesión primero",
      });
      navigate('/login');
      return;
    }

    // Try to make first user admin
    const isFirstUserAdmin = await checkFirstUser(user.id, user.email);
    if (isFirstUserAdmin) {
      setIsAdmin(true);
      return;
    }

    // Check if user is admin
    const isUserAdmin = await checkAdminStatus(user.id);
    if (!isUserAdmin) {
      console.log("Not an admin, redirecting...");
      toast({
        variant: "destructive",
        title: "Acceso denegado",
        description: "No tienes permisos de administrador",
      });
      navigate('/');
      return;
    }

    setIsAdmin(true);
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error("Error deleting publication:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la publicación",
      });
    } else {
      toast({
        title: "Publicación eliminada",
        description: "La publicación ha sido eliminada correctamente",
      });
      await refetchPublications();
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    }
  };

  const handleBanUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ banned: true })
      .eq('user_id', userId);

    if (error) {
      console.error("Error banning user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo banear al usuario",
      });
    } else {
      toast({
        title: "Usuario baneado",
        description: "El usuario ha sido baneado correctamente",
      });
      await refetchUsers();
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>
        <div className="space-y-8">
          <UsersList users={users} onBanUser={handleBanUser} />
          <PostsList posts={publications} onDeletePost={handleDeletePost} />
        </div>
      </main>
    </div>
  );
};

export default Admin;
