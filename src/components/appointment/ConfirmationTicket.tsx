'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Scissors, 
  Share2, 
  Download,
  QrCode,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: number;
  client: {
    name: string;
    email: string;
  };
  barbershop: {
    name: string;
    address: string;
    phone_number: string;
  };
  barber: {
    name: string;
    especialization: string;
  };
  service: {
    name: string;
    price: number;
    duration: number;
  };
  appointment_time: string;
  status: string;
  created_at: string;
}

interface ConfirmationTicketProps {
  appointment: Appointment;
  onClose?: () => void;
}

export default function ConfirmationTicket({ appointment, onClose }: ConfirmationTicketProps) {
  const appointmentDate = new Date(appointment.appointment_time);
  const qrCodeData = JSON.stringify({
    appointmentId: appointment.id,
    barbershop: appointment.barbershop.name,
    date: appointment.appointment_time,
    service: appointment.service.name
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Agendamento Confirmado - BarberPro',
          text: `Meu agendamento na ${appointment.barbershop.name} para ${format(appointmentDate, 'dd/MM/yyyy às HH:mm', { locale: ptBR })}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(
        `Agendamento confirmado na ${appointment.barbershop.name} para ${format(appointmentDate, 'dd/MM/yyyy às HH:mm', { locale: ptBR })}`
      );
      alert('Informações copiadas para a área de transferência!');
    }
  };

  const handleAddToGoogleCalendar = () => {
    const startDate = new Date(appointment.appointment_time);
    const endDate = new Date(startDate.getTime() + appointment.service.duration * 60000);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Agendamento BarberPro - ${appointment.service.name}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=Agendamento na ${appointment.barbershop.name} com ${appointment.barber.name}&location=${encodeURIComponent(appointment.barbershop.address)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const handleDownload = () => {
    const ticketContent = `
BARBERPRO - COMPROVANTE DE AGENDAMENTO

Cliente: ${appointment.client.name}
Barbearia: ${appointment.barbershop.name}
Endereço: ${appointment.barbershop.address}
Telefone: ${appointment.barbershop.phone_number}

Barbeiro: ${appointment.barber.name}
Especialização: ${appointment.barber.especialization}

Serviço: ${appointment.service.name}
Duração: ${appointment.service.duration} minutos
Preço: ${appointment.service.price.toLocaleString('pt-AO')} Kz

Data e Hora: ${format(appointmentDate, 'dd/MM/yyyy às HH:mm', { locale: ptBR })}
Status: ${appointment.status === 'confirmed' ? 'Confirmado' : appointment.status}

Código do Agendamento: #${appointment.id.toString().padStart(6, '0')}

Gerado em: ${format(new Date(appointment.created_at), 'dd/MM/yyyy às HH:mm', { locale: ptBR })}
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agendamento-${appointment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <CardTitle className="text-xl text-green-600">Agendamento Confirmado!</CardTitle>
        </div>
        <Badge className="bg-green-100 text-green-700 border-green-200">
          #{appointment.id.toString().padStart(6, '0')}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="text-center">
          <div className="bg-gray-100 p-4 rounded-lg inline-block">
            <QrCode className="h-24 w-24 text-gray-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Apresente este código na barbearia
          </p>
        </div>

        {/* Detalhes do Agendamento */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Data e Hora</p>
              <p className="font-semibold text-gray-800">
                {format(appointmentDate, 'dd/MM/yyyy às HH:mm', { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Barbearia</p>
              <p className="font-semibold text-gray-800">{appointment.barbershop.name}</p>
              <p className="text-sm text-gray-500">{appointment.barbershop.address}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Barbeiro</p>
              <p className="font-semibold text-gray-800">{appointment.barber.name}</p>
              {appointment.barber.especialization && (
                <p className="text-sm text-gray-500">{appointment.barber.especialization}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Scissors className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Serviço</p>
              <p className="font-semibold text-gray-800">{appointment.service.name}</p>
              <p className="text-sm text-gray-500">
                {appointment.service.duration} min • {appointment.service.price.toLocaleString('pt-AO')} Kz
              </p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3 pt-4 border-t">
          <Button 
            onClick={handleAddToGoogleCalendar}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Adicionar ao Google Calendar
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-medium mb-2">Informações Importantes:</p>
          <ul className="space-y-1 text-xs">
            <li>• Chegue 10 minutos antes do horário agendado</li>
            <li>• Apresente o código QR ou o comprovante</li>
            <li>• Em caso de cancelamento, entre em contato com a barbearia</li>
            <li>• Telefone: {appointment.barbershop.phone_number}</li>
          </ul>
        </div>

        {onClose && (
          <Button 
            onClick={onClose}
            variant="outline" 
            className="w-full"
          >
            Fechar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
