import { createContext, useState, useEffect, ReactNode } from 'react';
import { authService, RegisterData } from '../services/auth.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'kitchen';
  restaurantName?: string;
  assignedStation?: string;
  restaurantId?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (
      savedUser &&
      typeof savedUser === 'object' &&
      'id' in savedUser &&
      'name' in savedUser &&
      'email' in savedUser &&
      'role' in savedUser &&
      typeof savedUser.id === 'string' &&
      typeof savedUser.name === 'string' &&
      typeof savedUser.email === 'string' &&
      (savedUser.role === 'customer' || savedUser.role === 'admin' || savedUser.role === 'kitchen')
    ) {
      setUser({
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        restaurantName: typeof savedUser.restaurantName === 'string' ? savedUser.restaurantName : undefined,
        assignedStation: typeof savedUser.assignedStation === 'string' ? savedUser.assignedStation : undefined,
        restaurantId: typeof savedUser.restaurantId === 'string' ? savedUser.restaurantId : undefined,
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    setUser(data.user);
  };

  const register = async (formData: RegisterData) => {
    const data = await authService.register(formData);
    setUser(data.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

