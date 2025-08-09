'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

interface Barbershop {
  id: number;
  name: string;
  address: string;
}

export default function BarbershopList() {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBarbershops = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/barbershops/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBarbershops(response.data);
      } catch (err) {
        setError('Falha ao carregar as barbearias.');
        console.error(err);
      }
    };

    fetchBarbershops();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barbearias</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <ul className="space-y-4">
          {barbershops.map((barbershop) => (
            <li key={barbershop.id} className="border p-4 rounded-md">
              <h3 className="font-semibold">{barbershop.name}</h3>
              <p className="text-sm text-gray-500">{barbershop.address}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
