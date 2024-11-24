import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { ContactDialog } from "./ContactDialog";

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

  return (
    <Card className="card-hover">
      <ImageWithFallback
        src={image}
        alt={title}
        onLoad={() => {
          console.log("Image loaded successfully:", {
            url: image,
            title,
            timestamp: new Date().toISOString()
          });
        }}
      />
      
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
        <ContactDialog
          title={title}
          location={location}
          contact={contact}
        />
      </CardFooter>
    </Card>
  );
};