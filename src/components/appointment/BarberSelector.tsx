'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Barber {
  id: number;
  name: string;
}

interface Props {
  barbers: Barber[];
  onSelect: (barberId: string) => void;
  error?: string;
}

export default function BarberSelector({ barbers, onSelect, error }: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Selecione um Barbeiro</h3>
      <Select onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Escolha um barbeiro" />
        </SelectTrigger>
        <SelectContent>
          {barbers.map((barber) => (
            <SelectItem key={barber.id} value={String(barber.id)}>
              {barber.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
