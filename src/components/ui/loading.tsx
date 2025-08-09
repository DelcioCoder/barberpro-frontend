import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loading({ size = "md", text, className = "" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-orange-600`} />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Loading size="lg" text="Carregando..." />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="p-8">
      <Loading size="md" text="Carregando dados..." />
    </div>
  );
}
