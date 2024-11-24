import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Loading profile for user:", user);
      
      if (user) {
        setUser(user);
        const { data: posts, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error("Error loading posts:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudieron cargar tus publicaciones",
          });
        } else {
          console.log("User posts loaded:", posts);
          setUserPosts(posts || []);
        }
      }
    };

    loadUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Información de Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Email: {user?.email}</p>
          </CardContent>
        </Card>

        <h3 className="text-xl font-semibold mb-4">Mis Publicaciones</h3>
        {userPosts.length === 0 ? (
          <p className="text-gray-600">No tienes publicaciones todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{post.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;