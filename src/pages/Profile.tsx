import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Trash2, EyeOff, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
        await loadPublications(user.id);
      }
    };

    loadUserData();
  }, []);

  const loadPublications = async (userId: string) => {
    const { data: publications, error } = await supabase
      .from('publications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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
  };

  const handleDelete = async (publicationId: string) => {
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', publicationId);

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
      await loadPublications(user.id);
    }
  };

  const toggleActive = async (publicationId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('publications')
      .update({ is_active: !currentStatus })
      .eq('id', publicationId);

    if (error) {
      console.error("Error updating publication status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado de la publicación",
      });
    } else {
      toast({
        title: "Estado actualizado",
        description: `La publicación ha sido ${!currentStatus ? 'activada' : 'desactivada'} correctamente`,
      });
      await loadPublications(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
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
              <div key={publication.id} className="relative">
                <ItemCard
                  type={publication.type}
                  category={publication.category}
                  title={publication.title}
                  location={publication.location}
                  description={publication.description}
                  contact={publication.contact}
                  image={publication.image_url || '/placeholder.svg'}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => toggleActive(publication.id, publication.is_active)}
                    title={publication.is_active ? "Desactivar" : "Activar"}
                  >
                    {publication.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. La publicación será eliminada permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(publication.id)}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                {!publication.is_active && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center rounded-lg">
                    <p className="text-white font-semibold">Publicación Desactivada</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;