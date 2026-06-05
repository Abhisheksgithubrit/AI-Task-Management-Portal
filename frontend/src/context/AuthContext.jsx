import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginApi, register as registerApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem('token', data.token);
    const userData = { userId: data.userId, name: data.name, email: data.email };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await registerApi({ name, email, password });
    localStorage.setItem('token', data.token);
    const userData = { userId: data.userId, name: data.name, email: data.email };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!localStorage.getItem('token'),
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
