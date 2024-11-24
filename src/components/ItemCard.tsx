import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";

interface ItemCardProps {
  type: "oferta" | "solicitud" | "donacion";
  category: string;
  title: string;
  location: string;
  description: string;
  contact: string;
  image: string;
}

export const ItemCard = ({
  type,
  category,
  title,
  location,
  description,
  contact,
  image,
}: ItemCardProps) => {
  const { toast } = useToast();

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "oferta":
        return "default";
      case "solicitud":
        return "secondary";
      case "donacion":
        return "success";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "oferta":
        return "Oferta";
      case "solicitud":
        return "Solicitud";
      case "donacion":
        return "Donación";
      default:
        return type;
    }
  };

  const handleImageError = async (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", {
      imageUrl: image,
      error: "Loading failed - falling back to placeholder",
      status: e.currentTarget.naturalWidth === 0 ? "No image data received" : "Image data corrupted",
      timestamp: new Date().toISOString()
    });

    // Check if the bucket exists before trying to refresh the URL
    try {
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();

      if (bucketsError) {
        console.error("Error checking buckets:", bucketsError);
        e.currentTarget.src = '/placeholder.svg';
        return;
      }

      const imagesBucket = buckets?.find(b => b.name === 'images');
      if (!imagesBucket) {
        console.error("Images bucket not found");
        toast({
          title: "Error de almacenamiento",
          description: "No se pudo cargar la imagen. El bucket de imágenes no existe.",
          variant: "destructive",
        });
        e.currentTarget.src = '/placeholder.svg';
        return;
      }

      if (image.includes('supabase') && image.includes('storage')) {
        const filePath = image.split('/').pop();
        if (filePath) {
          const { data: publicUrl } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          console.log("Attempting to refresh Supabase URL:", {
            originalUrl: image,
            newUrl: publicUrl.publicUrl,
            timestamp: new Date().toISOString()
          });

          e.currentTarget.src = publicUrl.publicUrl;
          return;
        }
      }
    } catch (error) {
      console.error("Failed to refresh Supabase URL:", error);
    }
    
    e.currentTarget.src = '/placeholder.svg';
  };

  const processImageUrl = async () => {
    if (!image) return '/placeholder.svg';
    
    try {
      if (image.startsWith('http')) {
        return image;
      }
      
      // Check if bucket exists before trying to get URL
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();

      if (bucketsError || !buckets?.some(b => b.name === 'images')) {
        console.error("Images bucket not found or error:", bucketsError);
        return '/placeholder.svg';
      }

      // If it's just a filename, assume it's in Supabase storage
      if (!image.includes('/')) {
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(image);
        return data?.publicUrl || '/placeholder.svg';
      }
    } catch (error) {
      console.error("Error processing image URL:", error);
    }
    
    return '/placeholder.svg';
  };

  return (
    <Card className="card-hover">
      <div className="relative w-full h-48 bg-gray-50 rounded-t-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
          onLoad={() => {
            console.log("Image loaded successfully:", {
              url: image,
              title,
              timestamp: new Date().toISOString()
            });
          }}
        />
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <Badge variant={getBadgeVariant(type)}>
            {getTypeLabel(type)}
          </Badge>
        </div>
        <Badge variant="outline" className="w-fit">
          {category}
        </Badge>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contactar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Información de contacto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Publicación</h4>
                <p className="text-sm text-gray-500">{title}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Ubicación</h4>
                <p className="text-sm text-gray-500">{location}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Contacto</h4>
                <p className="text-sm text-gray-500">{contact}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};