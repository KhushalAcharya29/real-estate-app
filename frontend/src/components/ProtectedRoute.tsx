import { useGetMeQuery } from '../app/api';
import { Navigate, useLocation } from 'react-router-dom'; // Added useLocation
import type { ReactNode } from 'react';

export default function ProtectedRoute({
  role,
  children,
}: {
  role?: 'agent' | 'client';
  children: ReactNode;
}) {
  const { data, isLoading } = useGetMeQuery();
  const location = useLocation(); // 1. Capture where the user is trying to go

  // 2. ENHANCEMENT: Professional Loading State
  // (Replaces the plain text with a centered spinner)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Verifying access...</p>
      </div>
    );
  }

  const user = data?.user;

  // 3. ENHANCEMENT: Smart Redirect
  // We pass `state={{ from: location }}` so the Login page knows where to send them back
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>; 
}