import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ImageUpload } from "./ImageUpload";
import { useToast } from "./ui/use-toast";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // This is Google's test key. Replace with your actual key in production.

export const PublicationForm = () => {
  const { toast } = useToast();
  const [type, setType] = useState<"oferta" | "solicitud">("oferta");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaValue) {
      toast({
        title: "Error",
        description: "Por favor, completa el captcha antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    console.log("Form submitted:", { 
      type, 
      category, 
      title, 
      location, 
      description, 
      contact, 
      image,
      captchaValue 
    });
    
    toast({
      title: "Anuncio publicado",
      description: "Tu anuncio ha sido publicado correctamente.",
    });
  };

  const handleCaptchaChange = (value: string | null) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de anuncio</label>
        <Select
          value={type}
          onValueChange={(value: "oferta" | "solicitud") => setType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="oferta">Oferta</SelectItem>
            <SelectItem value="solicitud">Solicitud</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Categoría</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vehiculos">Vehículos</SelectItem>
            <SelectItem value="electrodomesticos">Electrodomésticos</SelectItem>
            <SelectItem value="muebles">Muebles</SelectItem>
            <SelectItem value="electronica">Electrónica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Título</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Sofá en buen estado"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ubicación</label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ej: Valencia Centro"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el artículo o la necesidad"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Contacto</label>
        <Input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Número de teléfono"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Imagen</label>
        <ImageUpload onImageSelected={setImage} />
      </div>

      <div className="flex justify-center my-4">
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
        />
      </div>

      <Button type="submit" className="w-full">
        Publicar Anuncio
      </Button>
    </form>
  );
};