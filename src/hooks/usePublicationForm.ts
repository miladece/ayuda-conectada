import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const usePublicationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [type, setType] = useState<"oferta" | "solicitud" | "donacion">("oferta");
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
    
    if (isSubmitting) return;

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
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, image);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }
        
        console.log("Image uploaded successfully:", uploadData);
        
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
        console.log("Public URL generated:", imageUrl);
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

      console.log("Publication created successfully");

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

  return {
    type,
    setType,
    category,
    setCategory,
    title,
    setTitle,
    location,
    setLocation,
    description,
    setDescription,
    contact,
    setContact,
    image,
    setImage,
    captchaValue,
    setCaptchaValue,
    isSubmitting,
    handleSubmit
  };
};