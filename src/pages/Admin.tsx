import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { UsersList } from "@/components/admin/UsersList";
import { PostsList } from "@/components/admin/PostsList";
import { checkFirstUser, checkAdminStatus } from "@/utils/adminUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminUsers } from "@/components/admin/hooks/useAdminUsers";
import { useAdminPublications } from "@/components/admin/hooks/useAdminPublications";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users = [], refetch: refetchUsers } = useAdminUsers(isAdmin);
  const { data: publications = [], refetch: refetchPublications } = useAdminPublications(isAdmin);

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