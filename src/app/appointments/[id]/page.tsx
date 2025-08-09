'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Scissors,
  DollarSign,
  Phone,
  MapPin,
  Calendar,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/lib/auth-context";
import { apiService, Appointment } from "@/lib/api";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { LoadingCard } from "@/components/ui/loading";

export default function AppointmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const appointmentId = params.id as string;

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAppointment(parseInt(appointmentId));
      setAppointment(data);
    } catch (err: any) {
      setError('Falha ao carregar dados do agendamento.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;
    
    try {
      await apiService.updateAppointment(appointment.id, { status: newStatus });
      setAppointment(prev => prev ? { ...prev, status: newStatus as any } : null);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleDelete = async () => {
    if (!appointment || !confirm('Tem certeza que deseja excluir este agendamento?')) return;
    
    try {
      await apiService.deleteAppointment(appointment.id);
      router.push('/appointments');
    } catch (err) {
      console.error('Erro ao excluir agendamento:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Agendado', color: 'bg-blue-100 text-blue-700' },
      confirmed: { label: 'Confirmado', color: 'bg-green-100 text-green-700' },
      in_progress: { label: 'Em Andamento', color: 'bg-yellow-100 text-yellow-700' },
      completed: { label: 'Concluído', color: 'bg-gray-100 text-gray-700' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
      no_show: { label: 'Não Compareceu', color: 'bg-red-100 text-red-700' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
      paid: { label: 'Pago', color: 'bg-green-100 text-green-700' },
      partial: { label: 'Parcial', color: 'bg-blue-100 text-blue-700' },
      refunded: { label: 'Reembolsado', color: 'bg-red-100 text-red-700' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <LoadingCard />
      </AuthenticatedLayout>
    );
  }

  if (!appointment) {
    return (
      <AuthenticatedLayout>
        <div className="p-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Agendamento não encontrado
              </h3>
              <p className="text-red-600 mb-4">
                O agendamento que você está procurando não existe ou foi removido.
              </p>
              <Button 
                onClick={() => router.push('/appointments')}
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Agendamentos
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/appointments')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Agendamento #{appointment.id}
                </h1>
                <p className="text-gray-600">
                  Detalhes completos do agendamento
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusBadge(appointment.status)}
              {getPaymentStatusBadge(appointment.payment_status)}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalhes do Agendamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Detalhes do Agendamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data e Hora</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {format(new Date(appointment.appointment_time), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Duração</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {appointment.duration} minutos
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status do Pagamento</label>
                    <div className="mt-1">
                      {getPaymentStatusBadge(appointment.payment_status)}
                    </div>
                  </div>
                </div>
                
                {appointment.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Observações</label>
                    <p className="text-gray-800 mt-1 p-3 bg-gray-50 rounded-md">
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informações do Cliente</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {appointment.client.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {appointment.client.phone}
                    </p>
                  </div>
                  {appointment.client.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-lg font-semibold text-gray-800">
                        {appointment.client.email}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gênero</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {appointment.client.gender === 'M' ? 'Masculino' : 
                       appointment.client.gender === 'F' ? 'Feminino' : 'Outro'}
                    </p>
                  </div>
                </div>
                
                {appointment.client.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Endereço</label>
                    <p className="text-gray-800 mt-1">
                      {appointment.client.address}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações do Serviço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scissors className="h-5 w-5" />
                  <span>Serviço e Barbeiro</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Serviço</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {appointment.service.name}
                    </p>
                    {appointment.service.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.service.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Barbeiro</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {appointment.barber.name}
                    </p>
                    {appointment.barber.specialization && (
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.barber.specialization}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => router.push(`/appointments/${appointment.id}/edit`)}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                
                {appointment.status === 'scheduled' && (
                  <Button
                    onClick={() => handleStatusChange('confirmed')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar
                  </Button>
                )}
                
                {appointment.status === 'confirmed' && (
                  <Button
                    onClick={() => handleStatusChange('completed')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Concluído
                  </Button>
                )}
                
                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                  <Button
                    onClick={() => handleStatusChange('cancelled')}
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                )}
                
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </CardContent>
            </Card>

            {/* Informações Financeiras */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Financeiro</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Preço do Serviço:</span>
                  <span className="font-semibold">
                    {appointment.service_price.toLocaleString('pt-AO')} Kz
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impostos:</span>
                  <span className="font-semibold">
                    {appointment.tax_amount.toLocaleString('pt-AO')} Kz
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor Pago:</span>
                  <span className="font-semibold">
                    {appointment.amount_paid.toLocaleString('pt-AO')} Kz
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-orange-600">
                      {appointment.total_amount.toLocaleString('pt-AO')} Kz
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Histórico</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Criado em</label>
                  <p className="text-sm text-gray-800">
                    {format(new Date(appointment.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
                {appointment.confirmed_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Confirmado em</label>
                    <p className="text-sm text-gray-800">
                      {format(new Date(appointment.confirmed_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                )}
                {appointment.completed_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Concluído em</label>
                    <p className="text-sm text-gray-800">
                      {format(new Date(appointment.completed_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Última atualização</label>
                  <p className="text-sm text-gray-800">
                    {format(new Date(appointment.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
