import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContextContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('jwtToken')
  );

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('jwtToken', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwtToken');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
