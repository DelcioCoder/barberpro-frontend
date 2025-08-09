'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navigation } from '@/components/ui/navigation';
import { LoadingPage } from '@/components/ui/loading';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
