import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AUTH_LOGOUT_EVENT } from "../services/api";
import { authService } from "../services/auth.service";
import type { LoginCredentials, RegisterData, User } from "../types";
import { TOKEN_KEY } from "../utils/constants";

export interface AuthContextValue {
  user: User | null;
  /** True while the stored session is being verified on first load. */
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the session from a stored token on first load
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    authService
      .getProfile()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // The API layer fires this when the server rejects the stored token
  useEffect(() => {
    const handleForcedLogout = () => setUser(null);
    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
  }, []);

  const register = useCallback(async (payload: RegisterData) => {
    const result = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
