'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import ServiceCard from "@/components/appointment/ServiceCard";
import BarberSelector from "@/components/appointment/BarberSelector";
import CalendarScheduler from "@/components/appointment/CalendarScheduler";
import ConfirmationTicket from "@/components/appointment/ConfirmationTicket";
import axios from "axios";

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  barbershop: number;
}

interface Barber {
  id: number;
  name: string;
  especialization: string;
  barbershop: number;
  rating?: number;
  isAvailable?: boolean;
}

interface Barbershop {
  id: number;
  name: string;
  address: string;
  phone_number: string;
}

export default function SchedulerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const barbershopId = searchParams.get('barbershopId');

  const [currentStep, setCurrentStep] = useState(1);
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (barbershopId) {
      fetchBarbershopData();
    }
  }, [barbershopId]);

  const fetchBarbershopData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/api/barbershops/${barbershopId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBarbershop(response.data);
    } catch (err) {
      setError('Falha ao carregar dados da barbearia.');
      console.error(err);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setCurrentStep(3);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmAppointment = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      setError('Por favor, complete todas as etapas do agendamento.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const appointmentData = {
        barbershop: barbershopId,
        barber: selectedBarber.id,
        service: selectedService.id,
        appointment_time: appointmentDateTime.toISOString(),
        status: 'scheduled'
      };

      const response = await axios.post(
        'http://127.0.0.1:8000/api/appointments/',
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAppointment(response.data);
      setShowConfirmation(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao confirmar agendamento.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'pending';
  };

  const steps = [
    { id: 1, title: 'Serviço', description: 'Escolha o serviço' },
    { id: 2, title: 'Barbeiro', description: 'Selecione o barbeiro' },
    { id: 3, title: 'Horário', description: 'Escolha data e hora' },
    { id: 4, title: 'Confirmar', description: 'Confirme o agendamento' }
  ];

  if (!barbershopId) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Barbearia não encontrada
              </h2>
              <p className="text-gray-600 mb-4">
                Não foi possível identificar a barbearia para agendamento.
              </p>
              <Button onClick={() => router.push('/')}>
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showConfirmation && appointment) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <ConfirmationTicket 
            appointment={appointment} 
            onClose={() => router.push('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          {barbershop && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {barbershop.name}
              </h1>
              <p className="text-gray-600 mb-4">{barbershop.address}</p>
              
              {/* Progress Steps */}
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      getStepStatus(step.id) === 'completed'
                        ? 'bg-orange-600 border-orange-600 text-white'
                        : getStepStatus(step.id) === 'current'
                        ? 'border-orange-600 text-orange-600'
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {getStepStatus(step.id) === 'completed' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-2 ${
                        getStepStatus(step.id) === 'completed' ? 'bg-orange-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Escolha o Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        isSelected={selectedService?.id === service.id}
                        onSelect={handleServiceSelect}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && selectedService && (
              <BarberSelector
                barbershopId={parseInt(barbershopId)}
                selectedBarber={selectedBarber}
                onSelectBarber={handleBarberSelect}
                selectedDate={selectedDate}
              />
            )}

            {currentStep === 3 && selectedBarber && (
              <CalendarScheduler
                barberId={selectedBarber.id}
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
                onSelectTime={handleTimeSelect}
                selectedTime={selectedTime}
              />
            )}

            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Confirmar Agendamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Resumo do Agendamento</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Serviço:</span>
                          <span className="font-medium">{selectedService?.name}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Barbeiro:</span>
                          <span className="font-medium">{selectedBarber?.name}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data e Hora:</span>
                          <span className="font-medium">
                            {selectedDate && selectedTime 
                              ? `${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}`
                              : 'Não selecionado'
                            }
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Preço:</span>
                          <span className="font-bold text-orange-600">
                            {selectedService?.price.toLocaleString('pt-AO')} Kz
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleConfirmAppointment}
                      disabled={loading}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        getStepStatus(step.id) === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : getStepStatus(step.id) === 'current'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {getStepStatus(step.id) === 'completed' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          getStepStatus(step.id) === 'current' ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


