import { useNavigate } from '@tanstack/react-router';
import { apiClient, authApi } from '@/api';
import { useState } from 'react';

export function useAuth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.login({ email, password });
      navigate({ to: '/chat' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register({ name, email, password });
      navigate({ to: '/login' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    navigate({ to: '/login' });
  };

  const isAuthenticated = () => {
    return apiClient.isAuthenticated();
  };

  return {
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
    error,
  };
}
