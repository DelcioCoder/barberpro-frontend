'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface Barber {
  id: number;
  name: string;
  especialization: string;
  barbershop: number;
  rating?: number;
  isAvailable?: boolean;
}

interface BarberSelectorProps {
  barbershopId: number;
  selectedBarber: Barber | null;
  onSelectBarber: (barber: Barber) => void;
  selectedDate?: Date;
}

export default function BarberSelector({ 
  barbershopId, 
  selectedBarber, 
  onSelectBarber, 
  selectedDate 
}: BarberSelectorProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/barbers/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { barbershop: barbershopId }
        });
        
        // Simular dados de avaliação e disponibilidade
        const barbersWithData = response.data.map((barber: Barber) => ({
          ...barber,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 estrelas
          isAvailable: Math.random() > 0.3 // 70% chance de estar disponível
        }));
        
        setBarbers(barbersWithData);
      } catch (err) {
        setError('Falha ao carregar os barbeiros.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (barbershopId) {
      fetchBarbers();
    }
  }, [barbershopId]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Barbeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Selecionar Barbeiro</span>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {barbers.length} disponíveis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div className="space-y-4">
          {barbers.map((barber) => (
            <Card
              key={barber.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedBarber?.id === barber.id
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-orange-300'
              } ${!barber.isAvailable ? 'opacity-60' : ''}`}
              onClick={() => barber.isAvailable && onSelectBarber(barber)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/api/avatars/${barber.id}`} alt={barber.name} />
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {barber.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">{barber.name}</h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(barber.rating || 0)}
                        <span className="text-sm text-gray-500 ml-1">
                          ({barber.rating})
                        </span>
                      </div>
                    </div>
                    
                    {barber.especialization && (
                      <p className="text-sm text-gray-600 mt-1">
                        {barber.especialization}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {barber.isAvailable ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">Disponível</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">Indisponível</span>
                          </>
                        )}
                      </div>
                      
                      {selectedBarber?.id === barber.id && (
                        <Badge className="bg-orange-600 text-white">
                          Selecionado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {barbers.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum barbeiro disponível no momento.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
