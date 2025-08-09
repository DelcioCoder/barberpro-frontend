'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  Scissors, 
  TrendingUp,
  ArrowRight,
  MapPin,
  Phone
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Verificar se o usuário está logado
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-brown-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-800">BarberPro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/login')}>
                Entrar
              </Button>
              <Button 
                onClick={() => router.push('/register')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Gerencie sua Barbearia com
            <span className="text-orange-600"> Facilidade</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo para agendamentos, gestão de clientes e controle financeiro. 
            Ideal para barbearias angolanas que querem crescer.
          </p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg"
          >
            Começar Agora
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Funcionalidades Principais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Agendamentos Inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sistema de agendamento online com calendário visual e confirmações automáticas.
                  Ideal para conexões lentas e uso mobile.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Gestão de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Histórico completo de serviços, programa de fidelidade e preferências dos clientes.
                  Mantenha seus clientes sempre satisfeitos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Relatórios Financeiros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Controle financeiro completo com relatórios detalhados, análise de lucros e
                  gestão de custos em Kwanzas (AOA).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Angola Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Adaptado para Angola
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 font-bold">AOA</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Moeda Local</h4>
              <p className="text-sm text-gray-600">
                Preços e relatórios em Kwanzas (AOA)
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Mobile-First</h4>
              <p className="text-sm text-gray-600">
                Otimizado para smartphones e tablets
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-yellow-600 font-bold">3G</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Conexão Lenta</h4>
              <p className="text-sm text-gray-600">
                Funciona bem com conexões instáveis
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Offline</h4>
              <p className="text-sm text-gray-600">
                Funciona mesmo sem internet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Planos e Preços
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Gratuito</CardTitle>
                <div className="text-3xl font-bold text-gray-800">
                  <span className="text-2xl">AOA</span> 0
                  <span className="text-sm text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✓ Até 50 agendamentos/mês</li>
                  <li>✓ Gestão básica de clientes</li>
                  <li>✓ 1 barbeiro</li>
                  <li>✓ Suporte por email</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-orange-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white">Mais Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Profissional</CardTitle>
                <div className="text-3xl font-bold text-gray-800">
                  <span className="text-2xl">AOA</span> 25.000
                  <span className="text-sm text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✓ Agendamentos ilimitados</li>
                  <li>✓ Gestão completa de clientes</li>
                  <li>✓ Até 5 barbeiros</li>
                  <li>✓ Relatórios avançados</li>
                  <li>✓ Suporte prioritário</li>
                </ul>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Escolher Plano
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Empresarial</CardTitle>
                <div className="text-3xl font-bold text-gray-800">
                  <span className="text-2xl">AOA</span> 50.000
                  <span className="text-sm text-gray-500">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>✓ Tudo do Profissional</li>
                  <li>✓ Barbeiros ilimitados</li>
                  <li>✓ Múltiplas filiais</li>
                  <li>✓ API personalizada</li>
                  <li>✓ Suporte 24/7</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Falar com Vendas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scissors className="h-6 w-6 text-orange-400" />
                <h3 className="text-xl font-bold">BarberPro</h3>
              </div>
              <p className="text-gray-300">
                Sistema completo para gestão de barbearias em Angola.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Funcionalidades</li>
                <li>Preços</li>
                <li>Integrações</li>
                <li>API</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Central de Ajuda</li>
                <li>Documentação</li>
                <li>Contato</li>
                <li>Status</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Sobre</li>
                <li>Blog</li>
                <li>Carreiras</li>
                <li>Privacidade</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 BarberPro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
