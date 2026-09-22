import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Company, RegisterData } from '../types/index.js';
import { ApiClient } from '../services/api.js';

interface AuthContextType {
  user: UserProfile | null;
  company: Company | null;
  accessibleCompanies: Company[];
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  switchCompany: (companyId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [accessibleCompanies, setAccessibleCompanies] = useState<Company[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    async function initAuth() {
      const token = ApiClient.getToken();
      if (!token) {
        setUser(null);
        setCompany(null);
        setAccessibleCompanies([]);
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        const res = await ApiClient.getMe();
        setUser(res.user);
        setCompany(res.company);
        setAccessibleCompanies(res.accessible_companies);
        setPermissions(res.permissions);
      } catch (err) {
        console.warn('Session expired or invalid:', err);
        ApiClient.clearToken();
        setUser(null);
        setCompany(null);
        setAccessibleCompanies([]);
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ApiClient.login(email, password);
      setUser(res.user);
      setCompany(res.company);
      setAccessibleCompanies(res.accessible_companies);
      setPermissions(res.permissions);
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ApiClient.register(data);
      setUser(res.user);
      setCompany(res.company);
      setAccessibleCompanies(res.accessible_companies);
      setPermissions(res.permissions);
    } catch (err: any) {
      setError(err.message || "Échec de l'enregistrement");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await ApiClient.logout();
      setUser(null);
      setCompany(null);
      setAccessibleCompanies([]);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const switchCompany = async (companyId: string) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.switchCompany(companyId);
      setCompany(res.company);
    } catch (err: any) {
      setError(err.message || 'Impossible de changer d’entreprise');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await ApiClient.getMe();
      setUser(res.user);
      setCompany(res.company);
      setAccessibleCompanies(res.accessible_companies);
      setPermissions(res.permissions);
    } catch (err) {
      console.warn('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        accessibleCompanies,
        permissions,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        switchCompany,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
