'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './button';
import { 
  Calendar, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Home,
  Scissors,
  Receipt,
  Bell,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Agendamentos', href: '/appointments', icon: Calendar },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Barbeiros', href: '/barbers', icon: Scissors },
  { name: 'Serviços', href: '/services', icon: Scissors },
  { name: 'Estoque', href: '/inventory', icon: Package },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Recibos', href: '/receipts', icon: Receipt },
  { name: 'Notificações', href: '/notifications', icon: Bell },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">BarberPro</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-4 border-t">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop navigation */}
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">BarberPro</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-gray-900">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </nav>
    </>
  );
}

// Componente para o ícone de logout
function LogOut({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}
