'use client';

import AppointmentList from "@/components/dashboard/AppointmentList";
import BarbershopList from "@/components/dashboard/BarbershopList";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel BarberPro</h1>
        <Button onClick={handleLogout}>Sair</Button>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BarbershopList />
        <AppointmentList />
      </main>
    </div>
  );
}
