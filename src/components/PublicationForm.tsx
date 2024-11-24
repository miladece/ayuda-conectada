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
import ReCAPTCHA from "react-google-recaptcha";
import { usePublicationForm } from "@/hooks/usePublicationForm";

const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

export const PublicationForm = () => {
  const {
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
    setCaptchaValue,
    isSubmitting,
    handleSubmit
  } = usePublicationForm();

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
          onChange={(value) => {
            console.log("Captcha value:", value);
            setCaptchaValue(value);
          }}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Publicando..." : "Publicar Anuncio"}
      </Button>
    </form>
  );
};