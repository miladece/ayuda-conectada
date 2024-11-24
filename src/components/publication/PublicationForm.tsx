import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { useToast } from "@/components/ui/use-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { PublicationTypeSelect } from "./PublicationTypeSelect";
import { PublicationCategorySelect } from "./PublicationCategorySelect";

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
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para publicar un anuncio.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!captchaValue) {
      toast({
        title: "Error",
        description: "Por favor, completa el captcha antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const { error } = await supabase
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

      if (error) throw error;

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
        description: "Error al publicar el anuncio. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <PublicationTypeSelect value={type} onChange={setType} />
      <PublicationCategorySelect value={category} onChange={setCategory} />

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
          onChange={(value) => {
            console.log("Captcha value:", value);
            setCaptchaValue(value);
          }}
        />
      </div>

      <Button type="submit" className="w-full">
        Publicar Anuncio
      </Button>
    </form>
  );
};