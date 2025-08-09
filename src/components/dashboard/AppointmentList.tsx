'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

interface Appointment {
  id: number;
  barbershop: string;
  service: string;
  barber: string;
  date_time: string;
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/appointments/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (err) {
        setError('Falha ao carregar os agendamentos.');
        console.error(err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="border p-4 rounded-md">
              <p><strong>Barbearia:</strong> {appointment.barbershop}</p>
              <p><strong>Serviço:</strong> {appointment.service}</p>
              <p><strong>Barbeiro:</strong> {appointment.barber}</p>
              <p><strong>Data:</strong> {new Date(appointment.date_time).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
