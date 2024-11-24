import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Phone } from "lucide-react";

interface ContactDialogProps {
  title: string;
  location: string;
  contact: string;
}

export const ContactDialog = ({ title, location, contact }: ContactDialogProps) => {
  return (
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
  );
};