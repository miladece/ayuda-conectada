import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PublicationCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const PublicationCategorySelect = ({ value, onChange }: PublicationCategorySelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Categoría</label>
      <Select value={value} onValueChange={onChange}>
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
  );
};