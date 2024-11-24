import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

export const PublicationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [type, setType] = useState<"oferta" | "solicitud">("oferta");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user in publication form:", user);
      setUser(user);
      
      if (!user) {
        toast({
          title: "Inicio de sesión requerido",
          description: "Por favor, inicia sesión para publicar un anuncio.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para publicar un anuncio.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      navigate('/login');
      return;
    }

    if (!captchaValue) {
      toast({
        title: "Error",
        description: "Por favor, completa el captcha antes de continuar.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = null;
      if (image) {
        console.log("Starting image upload process");
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        // Check if bucket exists and is accessible
        const { data: bucketData, error: bucketError } = await supabase
          .storage
          .getBucket('images');
          
        if (bucketError) {
          console.error("Error accessing bucket:", bucketError);
          throw new Error("Error accessing storage bucket");
        }
        
        console.log("Uploading file:", fileName);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }
        
        console.log("File uploaded successfully:", uploadData);
        
        const { data: { publicUrl }, error: urlError } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
          
        if (urlError) {
          console.error("Error getting public URL:", urlError);
          throw urlError;
        }
        
        console.log("Got public URL:", publicUrl);
        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('publications')
        .insert([
          {
            type,
            category,
            title,
            location,
            description,
            contact,
            image_url: imageUrl,
            user_id: user.id
          }
        ]);

      if (insertError) throw insertError;

      toast({
        title: "Anuncio publicado",
        description: "Tu anuncio ha sido publicado correctamente.",
      });

      // Reset form
      setType("oferta");
      setCategory("");
      setTitle("");
      setLocation("");
      setDescription("");
      setContact("");
      setImage(null);
      setCaptchaValue(null);
      
      navigate('/');
    } catch (error: any) {
      console.error("Error publishing:", error);
      toast({
        title: "Error",
        description: error.message || "Error al publicar el anuncio. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Publicando..." : "Publicar Anuncio"}
      </Button>
    </form>
  );
};
