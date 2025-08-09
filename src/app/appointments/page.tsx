'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Scissors,
  DollarSign,
  Phone,
  MapPin
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/lib/auth-context";
import { apiService, Appointment, Client, Barber, Service } from "@/lib/api";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { LoadingCard } from "@/components/ui/loading";

export default function AppointmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [barberFilter, setBarberFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados em paralelo
      const [appointmentsRes, clientsRes, barbersRes, servicesRes] = await Promise.all([
        apiService.getAppointments(),
        apiService.getClients(),
        apiService.getBarbers(),
        apiService.getServices()
      ]);

      setAppointments(appointmentsRes.results);
      setClients(clientsRes.results);
      setBarbers(barbersRes.results);
      setServices(servicesRes.results);

    } catch (err: any) {
      setError('Falha ao carregar dados dos agendamentos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      await apiService.updateAppointment(appointmentId, { status: newStatus });
      
      // Atualizar lista local
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus as any }
            : apt
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleDelete = async (appointmentId: number) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;
    
    try {
      await apiService.deleteAppointment(appointmentId);
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
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

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.client.phone.includes(searchTerm) ||
                         appointment.barber.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesDate = !dateFilter || appointment.appointment_time.startsWith(dateFilter);
    const matchesBarber = barberFilter === 'all' || appointment.barber.id.toString() === barberFilter;

    return matchesSearch && matchesStatus && matchesDate && matchesBarber;
  });

  if (loading) {
    return (
      <AuthenticatedLayout>
        <LoadingCard />
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
              <p className="text-gray-600">
                Gerencie todos os agendamentos da sua barbearia
              </p>
            </div>
            <Button 
              onClick={() => router.push('/appointments/new')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
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

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Cliente, telefone ou barbeiro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="no_show">Não Compareceu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="barber">Barbeiro</Label>
                <Select value={barberFilter} onValueChange={setBarberFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os barbeiros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os barbeiros</SelectItem>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id.toString()}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Agendamentos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Agendamentos ({filteredAppointments.length})
            </h2>
          </div>

          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Nenhum agendamento encontrado
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' || dateFilter || barberFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Não há agendamentos cadastrados ainda.'}
                </p>
                <Button 
                  onClick={() => router.push('/appointments/new')}
                  className="mt-4 bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Agendamento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {appointment.client.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              <span>{appointment.client.phone}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-orange-600">
                              {format(new Date(appointment.appointment_time), 'HH:mm', { locale: ptBR })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(appointment.appointment_time), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
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
                            <Clock className="h-4 w-4" />
                            <span>{appointment.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{appointment.service_price.toLocaleString('pt-AO')} Kz</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(appointment.status)}
                        
                        <div className="flex items-center space-x-1">
                          {appointment.status === 'scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {appointment.status === 'confirmed' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, 'completed')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/appointments/${appointment.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/appointments/${appointment.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(appointment.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
