import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (file: File | null) => void;
}

export const ImageUpload = ({ onImageSelected }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      console.error('File must be an image');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Resize image before upload
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            onImageSelected(resizedFile);
            console.log('Image resized successfully');
          }
        },
        'image/jpeg',
        0.8
      );
    };
    img.src = URL.createObjectURL(file);
  }, [onImageSelected]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    onImageSelected(null);
  }, [onImageSelected]);

  return (
    <div className="space-y-4">
      <div 
        className="relative flex items-center justify-center w-full"
        onDragEnter={handleDrag}
      >
        <label 
          className={`flex flex-col items-center justify-center w-full h-64 border-2 ${
            dragActive ? 'border-primary border-solid' : 'border-gray-300 border-dashed'
          } rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors`}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-gray-500">PNG, JPG o JPEG (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {preview && (
        <div className="relative w-full h-48">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};