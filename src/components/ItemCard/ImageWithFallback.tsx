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
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    const loadImage = async () => {
      console.log("Loading image:", src);
      
      if (!src) {
        setImgSrc('/placeholder.svg');
        return;
      }

      try {
        // If it's a Supabase URL, get a fresh public URL
        if (src.includes('supabase.co')) {
          const fileName = src.split('/').pop();
          if (fileName) {
            const { data } = supabase.storage
              .from('images')
              .getPublicUrl(fileName);
            
            console.log("Generated fresh Supabase URL:", {
              originalUrl: src,
              newUrl: data.publicUrl,
              timestamp: new Date().toISOString()
            });
            
            setImgSrc(data.publicUrl + '?t=' + new Date().getTime());
            return;
          }
        }
        
        // For other URLs, use as is
        setImgSrc(src);
      } catch (error) {
        console.error("Error processing image URL:", error);
        setImgSrc('/placeholder.svg');
      }
    };

    loadImage();
  }, [src]);

  const handleError = () => {
    console.error("Image failed to load:", {
      imageUrl: imgSrc,
      error: "Loading failed - falling back to placeholder",
      timestamp: new Date().toISOString()
    });
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