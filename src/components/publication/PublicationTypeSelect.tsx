import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PublicationTypeSelectProps {
  value: "oferta" | "solicitud";
  onChange: (value: "oferta" | "solicitud") => void;
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
        </SelectContent>
      </Select>
    </div>
  );
};