'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Clock } from "lucide-react";

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  barbershop: number;
}

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

export default function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'border-orange-500 bg-orange-50 shadow-md' 
          : 'border-gray-200 hover:border-orange-300'
      }`}
      onClick={() => onSelect(service)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {service.name}
          </CardTitle>
          <Scissors className="h-5 w-5 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{service.duration} min</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-orange-600">
              {service.price.toLocaleString('pt-AO')} Kz
            </span>
          </div>
        </div>
        
        <Button 
          className={`w-full ${
            isSelected 
              ? 'bg-orange-600 hover:bg-orange-700 text-white' 
              : 'bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700'
          }`}
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? 'Selecionado' : 'Selecionar'}
        </Button>
      </CardContent>
    </Card>
  );
}
