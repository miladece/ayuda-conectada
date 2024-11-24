import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Phone } from "lucide-react";

interface ItemCardProps {
  type: "oferta" | "solicitud";
  category: string;
  title: string;
  location: string;
  description: string;
  contact: string;
}

export const ItemCard = ({
  type,
  category,
  title,
  location,
  description,
  contact,
}: ItemCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <Badge variant={type === "oferta" ? "default" : "secondary"}>
            {type === "oferta" ? "Oferta" : "Solicitud"}
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
        <Button className="w-full flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Contactar
        </Button>
      </CardFooter>
    </Card>
  );
};