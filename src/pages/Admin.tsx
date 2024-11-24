import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { UsersList } from "@/components/admin/UsersList";
import { PostsList } from "@/components/admin/PostsList";
import { checkFirstUser, checkAdminStatus } from "@/utils/adminUtils";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      loadData();
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
    loadData();
  };

  const loadData = async () => {
    console.log("Loading admin data...");
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('*');
    
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*');
    
    if (usersError) {
      console.error("Error loading users:", usersError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los usuarios",
      });
    }

    if (postsError) {
      console.error("Error loading posts:", postsError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las publicaciones",
      });
    }
    
    if (usersData) setUsers(usersData);
    if (postsData) setPosts(postsData);
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
      loadData();
    }
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error("Error deleting post:", error);
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
      loadData();
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
          <PostsList posts={posts} onDeletePost={handleDeletePost} />
        </div>
      </main>
    </div>
  );
};

export default Admin;