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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Error loading image:", {
      src: image,
      error: "Image failed to load",
      element: e.currentTarget
    });
    
    // Check if the error is due to a Supabase storage issue
    if (image.includes('supabase') && image.includes('storage')) {
      console.error("Possible Supabase storage configuration issue. Please check bucket permissions and policies.");
    }
    
    e.currentTarget.src = '/placeholder.svg';
  };

  console.log("ItemCard render:", {
    type,
    title,
    imageUrl: image,
    timestamp: new Date().toISOString()
  });

  return (
    <Card className="card-hover">
      <div className="relative w-full h-48 bg-gray-50 rounded-t-lg overflow-hidden">
        <img
          src={image || '/placeholder.svg'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleImageError}
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