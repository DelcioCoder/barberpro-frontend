'use client';

import BarberSelector from "@/components/appointment/BarberSelector";
import CalendarScheduler from "@/components/appointment/CalendarScheduler";
import ServiceSelector from "@/components/appointment/ServiceSelector";
import { Button } from "@/components/ui/button";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  serviceId: z.string().nonempty("Selecione um serviço"),
  barberId: z.string().nonempty("Selecione um barbeiro"),
  date: z.date({ required_error: "Selecione uma data" }),
});

interface Service {
  id: number;
  name: string;
}

interface Barber {
  id: number;
  name: string;
}

export default function SchedulerPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const barbershopId = params.barbershopId;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [servicesRes, barbersRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/barbershops/${barbershopId}/services/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://127.0.0.1:8000/api/barbershops/${barbershopId}/barbers/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setServices(servicesRes.data);
        setBarbers(barbersRes.data);
      } catch (err) {
        setError('Falha ao carregar dados da barbearia.');
        console.error(err);
      }
    };

    if (barbershopId) {
      fetchData();
    }
  }, [barbershopId]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:8000/api/appointments/', {
        barbershop: barbershopId,
        service: data.serviceId,
        barber: data.barberId,
        date_time: data.date.toISOString(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push(`/appointments/${response.data.id}`);
    } catch (err) {
      setError('Falha ao criar agendamento. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agendar Horário</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ServiceSelector
          services={services}
          onSelect={(serviceId) => setValue('serviceId', serviceId)}
          error={errors.serviceId?.message}
        />
        <BarberSelector
          barbers={barbers}
          onSelect={(barberId) => setValue('barberId', barberId)}
          error={errors.barberId?.message}
        />
        <CalendarScheduler
          onSelect={(date) => setValue('date', date)}
          error={errors.date?.message}
        />
        <Button
          type="submit"
          className="w-full py-6 text-lg"
        >
          Confirmar Agendamento
        </Button>
      </form>
    </div>
  );
}


