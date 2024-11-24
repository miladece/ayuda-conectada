import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Current user:", user);

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();

    console.log("User profile:", profile);

    if (error || profile?.role !== 'admin') {
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
      .eq('id', userId);

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
          <section>
            <h3 className="text-xl font-semibold mb-4">Usuarios</h3>
            <div className="grid gap-4">
              {users.map((user: any) => (
                <div key={user.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleBanUser(user.id)}
                  >
                    Banear Usuario
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Publicaciones</h3>
            <div className="grid gap-4">
              {posts.map((post: any) => (
                <div key={post.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-gray-500">Por: {post.user_id}</p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Eliminar Publicación
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Admin;