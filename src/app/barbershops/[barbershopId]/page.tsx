'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Service {
  id: number;
  name: string;
  price: string;
}

interface Barber {
  id: number;
  name: string;
}

interface Barbershop {
  id: number;
  name: string;
  address: string;
  services: Service[];
  barbers: Barber[];
}

export default function BarbershopDetailsPage() {
  const { barbershopId } = useParams();
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (barbershopId) {
      const fetchBarbershopDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://127.0.0.1:8000/api/barbershops/${barbershopId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBarbershop(response.data);
        } catch (err) {
          setError('Falha ao carregar os detalhes da barbearia.');
          console.error(err);
        }
      };

      fetchBarbershopDetails();
    }
  }, [barbershopId]);

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  if (!barbershop) {
    return <p className="text-center mt-8">Carregando...</p>;
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>{barbershop.name}</CardTitle>
          <p className="text-sm text-gray-500">{barbershop.address}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Serviços</h3>
            <ul className="space-y-2 mt-2">
              {barbershop.services.map((service) => (
                <li key={service.id} className="flex justify-between">
                  <span>{service.name}</span>
                  <span>R$ {service.price}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Barbeiros</h3>
            <ul className="space-y-2 mt-2">
              {barbershop.barbers.map((barber) => (
                <li key={barber.id}>{barber.name}</li>
              ))}
            </ul>
          </div>
          <Link href={`/barbershops/${barbershopId}/scheduler`}>
            <Button className="w-full">Agendar Horário</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
