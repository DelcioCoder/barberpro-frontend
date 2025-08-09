'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Service {
  id: number;
  name: string;
}

interface Props {
  services: Service[];
  onSelect: (serviceId: string) => void;
  error?: string;
}

export default function ServiceSelector({ services, onSelect, error }: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Selecione um Serviço</h3>
      <Select onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Escolha um serviço" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.id} value={String(service.id)}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
