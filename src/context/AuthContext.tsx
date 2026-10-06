import { createContext, useState, useEffect, ReactNode } from 'react';
import { authService, RegisterData } from '../services/auth.service';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'kitchen';
  restaurantName?: string;
  restaurant?: string;
  assignedStation?: string;
  restaurantId?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateUser: (updates: Partial<User> | null) => void;
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
        id: typeof savedUser.id === 'string' ? savedUser.id : (typeof savedUser._id === 'string' ? savedUser._id : ''),
        _id: typeof savedUser._id === 'string' ? savedUser._id : undefined,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        restaurantName: typeof savedUser.restaurantName === 'string' ? savedUser.restaurantName : undefined,
        restaurant: typeof savedUser.restaurant === 'string' ? savedUser.restaurant : undefined,
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

  const updateUser = (updates: Partial<User> | null) => {
    setUser((currentUser) => {
      if (!currentUser && !updates) return null;
      if (!currentUser) return updates ? ({ ...updates } as User) : null;
      if (!updates) return null;
      return { ...currentUser, ...updates };
    });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUser, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

