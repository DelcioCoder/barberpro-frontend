import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Tipos para as respostas da API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Tipos para os modelos do backend
export interface Tenant {
  id: number;
  name: string;
  slug: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  address: string;
  city: string;
  province: string;
  opening_hours: string;
  closing_hours: string;
  working_days: number[];
  is_active: boolean;
  subscription_plan: 'free' | 'basic' | 'premium' | 'enterprise';
  currency: string;
  tax_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  gender: 'M' | 'F' | 'O';
  birth_date?: string;
  address?: string;
  loyalty_points: number;
  total_spent: number;
  visits_count: number;
  preferred_barber?: number;
  notes?: string;
  loyalty_level: string;
  created_at: string;
  updated_at: string;
}

export interface Barber {
  id: number;
  name: string;
  phone: string;
  email?: string;
  specialization: string;
  experience_years: number;
  bio?: string;
  photo?: string;
  is_active: boolean;
  is_available: boolean;
  total_appointments: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  category: string;
  duration: number;
  price: number;
  is_active: boolean;
  requires_appointment: boolean;
  total_bookings: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  client: Client;
  barber: Barber;
  service: Service;
  appointment_time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'paid' | 'partial' | 'refunded';
  service_price: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  notes?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  completed_at?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: number;
  supplier?: number;
  sku: string;
  barcode?: string;
  unit: string;
  cost_price: number;
  selling_price: number;
  current_stock: number;
  min_stock_level: number;
  max_stock_level: number;
  is_active: boolean;
  is_consumable: boolean;
  image?: string;
  stock_status: string;
  stock_value: number;
  profit_margin: number;
  created_at: string;
  updated_at: string;
}

export interface FinancialReport {
  id: number;
  report_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  total_revenue: number;
  service_revenue: number;
  product_revenue: number;
  total_cost: number;
  product_cost: number;
  operational_cost: number;
  gross_profit: number;
  net_profit: number;
  total_tax: number;
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  average_ticket: number;
  profit_margin: number;
  completion_rate: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetric {
  id: number;
  metric_type: 'revenue' | 'appointments' | 'clients' | 'inventory' | 'performance';
  name: string;
  value: number;
  unit: string;
  period: string;
  previous_value?: number;
  change_percentage?: number;
  is_positive: boolean;
  display_order: number;
  trend_direction: 'up' | 'down' | 'neutral';
  calculated_at: string;
  updated_at: string;
}

// Configuração da API
class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratamento de erros
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado, redirecionar para login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  async login(credentials: { username: string; password: string }) {
    const response = await this.api.post('/api/auth/login/', credentials);
    const { access, refresh } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return response.data;
  }

  async register(userData: { username: string; email: string; password: string }) {
    const response = await this.api.post('/api/auth/register/', userData);
    return response.data;
  }

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');
    
    const response = await this.api.post('/api/auth/refresh/', { refresh });
    const { access } = response.data;
    
    localStorage.setItem('access_token', access);
    return response.data;
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async getUserProfile() {
    const response = await this.api.get('/api/auth/profile/');
    return response.data;
  }

  // Métodos para Tenants
  async getTenants(): Promise<PaginatedResponse<Tenant>> {
    const response = await this.api.get('/api/tenants/');
    return response.data;
  }

  async getTenant(id: number): Promise<Tenant> {
    const response = await this.api.get(`/api/tenants/${id}/`);
    return response.data;
  }

  async createTenant(tenantData: Partial<Tenant>): Promise<Tenant> {
    const response = await this.api.post('/api/tenants/', tenantData);
    return response.data;
  }

  async updateTenant(id: number, tenantData: Partial<Tenant>): Promise<Tenant> {
    const response = await this.api.put(`/api/tenants/${id}/`, tenantData);
    return response.data;
  }

  // Métodos para Clientes
  async getClients(params?: any): Promise<PaginatedResponse<Client>> {
    const response = await this.api.get('/api/clients/', { params });
    return response.data;
  }

  async getClient(id: number): Promise<Client> {
    const response = await this.api.get(`/api/clients/${id}/`);
    return response.data;
  }

  async createClient(clientData: Partial<Client>): Promise<Client> {
    const response = await this.api.post('/api/clients/', clientData);
    return response.data;
  }

  async updateClient(id: number, clientData: Partial<Client>): Promise<Client> {
    const response = await this.api.put(`/api/clients/${id}/`, clientData);
    return response.data;
  }

  async deleteClient(id: number): Promise<void> {
    await this.api.delete(`/api/clients/${id}/`);
  }

  // Métodos para Barbeiros
  async getBarbers(params?: any): Promise<PaginatedResponse<Barber>> {
    const response = await this.api.get('/api/barbers/', { params });
    return response.data;
  }

  async getBarber(id: number): Promise<Barber> {
    const response = await this.api.get(`/api/barbers/${id}/`);
    return response.data;
  }

  async createBarber(barberData: Partial<Barber>): Promise<Barber> {
    const response = await this.api.post('/api/barbers/', barberData);
    return response.data;
  }

  async updateBarber(id: number, barberData: Partial<Barber>): Promise<Barber> {
    const response = await this.api.put(`/api/barbers/${id}/`, barberData);
    return response.data;
  }

  async deleteBarber(id: number): Promise<void> {
    await this.api.delete(`/api/barbers/${id}/`);
  }

  // Métodos para Serviços
  async getServices(params?: any): Promise<PaginatedResponse<Service>> {
    const response = await this.api.get('/api/services/', { params });
    return response.data;
  }

  async getService(id: number): Promise<Service> {
    const response = await this.api.get(`/api/services/${id}/`);
    return response.data;
  }

  async createService(serviceData: Partial<Service>): Promise<Service> {
    const response = await this.api.post('/api/services/', serviceData);
    return response.data;
  }

  async updateService(id: number, serviceData: Partial<Service>): Promise<Service> {
    const response = await this.api.put(`/api/services/${id}/`, serviceData);
    return response.data;
  }

  async deleteService(id: number): Promise<void> {
    await this.api.delete(`/api/services/${id}/`);
  }

  // Métodos para Agendamentos
  async getAppointments(params?: any): Promise<PaginatedResponse<Appointment>> {
    const response = await this.api.get('/api/appointments/', { params });
    return response.data;
  }

  async getAppointment(id: number): Promise<Appointment> {
    const response = await this.api.get(`/api/appointments/${id}/`);
    return response.data;
  }

  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await this.api.post('/api/appointments/', appointmentData);
    return response.data;
  }

  async updateAppointment(id: number, appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await this.api.put(`/api/appointments/${id}/`, appointmentData);
    return response.data;
  }

  async deleteAppointment(id: number): Promise<void> {
    await this.api.delete(`/api/appointments/${id}/`);
  }

  async cancelAppointment(id: number, reason?: string): Promise<Appointment> {
    const response = await this.api.patch(`/api/appointments/${id}/cancel/`, { reason });
    return response.data;
  }

  async confirmAppointment(id: number): Promise<Appointment> {
    const response = await this.api.patch(`/api/appointments/${id}/confirm/`);
    return response.data;
  }

  // Métodos para Produtos
  async getProducts(params?: any): Promise<PaginatedResponse<Product>> {
    const response = await this.api.get('/api/products/', { params });
    return response.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.api.get(`/api/products/${id}/`);
    return response.data;
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await this.api.post('/api/products/', productData);
    return response.data;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const response = await this.api.put(`/api/products/${id}/`, productData);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.api.delete(`/api/products/${id}/`);
  }

  // Métodos para Relatórios
  async getFinancialReports(params?: any): Promise<PaginatedResponse<FinancialReport>> {
    const response = await this.api.get('/api/reports/financial/', { params });
    return response.data;
  }

  async getDashboardMetrics(): Promise<DashboardMetric[]> {
    const response = await this.api.get('/api/reports/analytics/dashboard/');
    return response.data;
  }

  // Métodos para Horários
  async getAvailableSlots(barberId: number, date: string): Promise<any[]> {
    const response = await this.api.get(`/api/schedules/available/${barberId}/`, {
      params: { date }
    });
    return response.data;
  }

  // Utilitários
  getBaseURL(): string {
    return this.baseURL;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

// Instância singleton da API
export const apiService = new ApiService();

// Hooks personalizados para React
export const useApi = () => {
  return apiService;
};
