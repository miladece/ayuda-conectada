import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemCard } from "@/components/ItemCard";

const Profile = () => {
  const [userPublications, setUserPublications] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Loading profile for user:", user);
      
      if (user) {
        setUser(user);
        const { data: publications, error } = await supabase
          .from('publications')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error("Error loading publications:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudieron cargar tus publicaciones",
          });
        } else {
          console.log("User publications loaded:", publications);
          setUserPublications(publications || []);
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
        {userPublications.length === 0 ? (
          <p className="text-gray-600">No tienes publicaciones todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPublications.map((publication) => (
              <ItemCard
                key={publication.id}
                type={publication.type}
                category={publication.category}
                title={publication.title}
                location={publication.location}
                description={publication.description}
                contact={publication.contact}
                image={publication.image_url || '/placeholder.svg'}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;