'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Plus,
  Eye,
  Phone,
  MapPin,
  User,
  Scissors,
  Package,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/lib/auth-context";
import { apiService, Appointment, DashboardMetric } from "@/lib/api";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { LoadingCard } from "@/components/ui/loading";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar agendamentos do dia
      const today = format(new Date(), 'yyyy-MM-dd');
      const appointmentsResponse = await apiService.getAppointments({ 
        date: today,
        status: 'scheduled,confirmed'
      });
      setAppointments(appointmentsResponse.results);

      // Buscar métricas do dashboard
      try {
        const metricsResponse = await apiService.getDashboardMetrics();
        setDashboardMetrics(metricsResponse);
      } catch (metricsError) {
        console.warn('Erro ao carregar métricas:', metricsError);
        // Usar dados mock se a API não estiver disponível
        setDashboardMetrics([
          {
            id: 1,
            metric_type: 'revenue',
            name: 'Receita Hoje',
            value: 125000,
            unit: 'Kz',
            period: 'today',
            previous_value: 110000,
            change_percentage: 13.6,
            is_positive: true,
            display_order: 1,
            trend_direction: 'up',
            calculated_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            metric_type: 'appointments',
            name: 'Agendamentos Hoje',
            value: appointmentsResponse.results.length,
            unit: '',
            period: 'today',
            previous_value: 8,
            change_percentage: 12.5,
            is_positive: true,
            display_order: 2,
            trend_direction: 'up',
            calculated_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 3,
            metric_type: 'clients',
            name: 'Novos Clientes',
            value: 3,
            unit: '',
            period: 'today',
            previous_value: 2,
            change_percentage: 50,
            is_positive: true,
            display_order: 3,
            trend_direction: 'up',
            calculated_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 4,
            metric_type: 'performance',
            name: 'Taxa de Conclusão',
            value: 95,
            unit: '%',
            period: 'today',
            previous_value: 92,
            change_percentage: 3.3,
            is_positive: true,
            display_order: 4,
            trend_direction: 'up',
            calculated_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      }

    } catch (err: any) {
      setError('Falha ao carregar dados do dashboard.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (appointmentId: number) => {
    try {
      await apiService.updateAppointment(appointmentId, { status: 'completed' });
      
      // Atualizar lista local
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'completed' }
            : apt
        )
      );
    } catch (err) {
      console.error('Erro ao marcar como concluído:', err);
    }
  };

  const handleViewDetails = (appointmentId: number) => {
    router.push(`/appointments/${appointmentId}`);
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

  const getMetricIcon = (metricType: string) => {
    switch (metricType) {
      case 'revenue':
        return <DollarSign className="h-8 w-8 text-green-500" />;
      case 'appointments':
        return <Calendar className="h-8 w-8 text-blue-500" />;
      case 'clients':
        return <Users className="h-8 w-8 text-purple-500" />;
      case 'inventory':
        return <Package className="h-8 w-8 text-orange-500" />;
      case 'performance':
        return <BarChart3 className="h-8 w-8 text-indigo-500" />;
      default:
        return <TrendingUp className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Bem-vindo, {user?.first_name || 'Usuário'}! Aqui está o resumo do seu negócio.
          </p>
        </div>

        {loading ? (
          <LoadingCard />
        ) : (
          <>
            {/* Métricas do Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardMetrics.map((metric) => (
                <Card key={metric.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{metric.name}</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {metric.value.toLocaleString('pt-AO')} {metric.unit}
                        </p>
                        {metric.change_percentage && (
                          <p className={`text-sm ${metric.is_positive ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.is_positive ? '+' : ''}{metric.change_percentage}% vs período anterior
                          </p>
                        )}
                      </div>
                      {getMetricIcon(metric.metric_type)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
              <Button
                variant={activeTab === 'appointments' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('appointments')}
                className="flex-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendamentos do Dia
              </Button>
              <Button
                variant={activeTab === 'financial' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('financial')}
                className="flex-1"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Financeiro
              </Button>
              <Button
                variant={activeTab === 'clients' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('clients')}
                className="flex-1"
              >
                <Users className="h-4 w-4 mr-2" />
                Clientes
              </Button>
              <Button
                variant={activeTab === 'inventory' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('inventory')}
                className="flex-1"
              >
                <Package className="h-4 w-4 mr-2" />
                Estoque
              </Button>
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

            {/* Content */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Agendamentos de {format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}
                  </h2>
                  <Badge className="bg-orange-100 text-orange-700">
                    {appointments.length} agendamentos
                  </Badge>
                </div>

                {appointments.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Nenhum agendamento hoje
                      </h3>
                      <p className="text-gray-500">
                        Não há agendamentos programados para hoje.
                      </p>
                      <Button 
                        onClick={() => router.push('/appointments/new')}
                        className="mt-4 bg-orange-600 hover:bg-orange-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Agendamento
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <h3 className="font-semibold text-gray-800">
                                    {appointment.client.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">{appointment.client.phone}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-lg font-bold text-orange-600">
                                    {format(new Date(appointment.appointment_time), 'HH:mm', { locale: ptBR })}
                                  </p>
                                  <p className="text-xs text-gray-500">Horário</p>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex items-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <User className="h-4 w-4" />
                                  <span>{appointment.barber.name}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Scissors className="h-4 w-4" />
                                  <span>{appointment.service.name}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{appointment.service_price.toLocaleString('pt-AO')} Kz</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(appointment.status)}
                              
                              {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleMarkCompleted(appointment.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(appointment.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'financial' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Relatório Financeiro</h2>
                
                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {dashboardMetrics
                    .filter(metric => metric.metric_type === 'revenue')
                    .map((metric) => (
                      <Card key={metric.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">{metric.name}</p>
                              <p className="text-2xl font-bold text-gray-800">
                                {metric.value.toLocaleString('pt-AO')} {metric.unit}
                              </p>
                              {metric.change_percentage && (
                                <p className={`text-sm ${metric.is_positive ? 'text-green-600' : 'text-red-600'}`}>
                                  {metric.is_positive ? '+' : ''}{metric.change_percentage}%
                                </p>
                              )}
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {/* Relatório Mensal */}
                <Card>
                  <CardHeader>
                    <CardTitle>Relatório Mensal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Grafícos e relatórios detalhados serão implementados aqui.</p>
                      <Button 
                        onClick={() => router.push('/reports/financial')}
                        className="mt-4 bg-orange-600 hover:bg-orange-700"
                      >
                        Ver Relatórios Completos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Gestão de Clientes</h2>
                  <Button 
                    onClick={() => router.push('/clients/new')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Cliente
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Gestão de Clientes
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Gerencie seus clientes, histórico de serviços e programa de fidelidade.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button 
                        onClick={() => router.push('/clients')}
                        variant="outline"
                      >
                        Ver Todos os Clientes
                      </Button>
                      <Button 
                        onClick={() => router.push('/clients/loyalty')}
                        variant="outline"
                      >
                        Programa de Fidelidade
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Gestão de Estoque</h2>
                  <Button 
                    onClick={() => router.push('/inventory/products/new')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Controle de Estoque
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Gerencie produtos, controle de estoque e alertas de reposição.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button 
                        onClick={() => router.push('/inventory/products')}
                        variant="outline"
                      >
                        Ver Produtos
                      </Button>
                      <Button 
                        onClick={() => router.push('/inventory/movements')}
                        variant="outline"
                      >
                        Movimentações
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
