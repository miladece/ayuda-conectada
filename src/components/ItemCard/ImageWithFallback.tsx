import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "../ui/use-toast";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  onLoad?: () => void;
}

export const ImageWithFallback = ({ src, alt, onLoad }: ImageWithFallbackProps) => {
  const { toast } = useToast();
  const [imgSrc, setImgSrc] = useState<string>(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = async () => {
    console.error("Image failed to load:", {
      imageUrl: src,
      error: "Loading failed - falling back to placeholder",
      status: "Image load error",
      timestamp: new Date().toISOString()
    });

    try {
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();

      if (bucketsError || !buckets?.some(b => b.name === 'images')) {
        console.error("Images bucket not found or error:", bucketsError);
        toast({
          title: "Error de almacenamiento",
          description: "No se pudo cargar la imagen. El bucket de imágenes no existe.",
          variant: "destructive",
        });
        setImgSrc('/placeholder.svg');
        return;
      }

      if (src.includes('supabase') && src.includes('storage')) {
        const filePath = src.split('/').pop();
        if (filePath) {
          const { data: publicUrl } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          console.log("Attempting to refresh Supabase URL:", {
            originalUrl: src,
            newUrl: publicUrl.publicUrl,
            timestamp: new Date().toISOString()
          });

          setImgSrc(publicUrl.publicUrl);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to refresh Supabase URL:", error);
    }
    
    setImgSrc('/placeholder.svg');
  };

  return (
    <div className="relative w-full h-48 bg-gray-50 rounded-t-lg overflow-hidden">
      <img
        src={imgSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        onError={handleError}
        loading="lazy"
        onLoad={onLoad}
      />
    </div>
  );
};