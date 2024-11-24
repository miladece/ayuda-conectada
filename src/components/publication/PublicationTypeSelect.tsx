import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PublicationTypeSelectProps {
  value: "oferta" | "solicitud" | "donacion";
  onChange: (value: "oferta" | "solicitud" | "donacion") => void;
}

export const PublicationTypeSelect = ({ value, onChange }: PublicationTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tipo de anuncio</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona el tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="oferta">Oferta</SelectItem>
          <SelectItem value="solicitud">Solicitud</SelectItem>
          <SelectItem value="donacion">Donación</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};