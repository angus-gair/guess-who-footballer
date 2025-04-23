import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  AuthState, 
  LoginRequest, 
  RegisterRequest, 
  GuestLoginRequest 
} from '../types/user';
import { authService } from '../services/api';

// Define the context type
interface UserContextType {
  authState: AuthState;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  guestLogin: (data: GuestLoginRequest) => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
}

// Create context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Initial auth state
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

// Props type for provider component
interface UserProviderProps {
  children: ReactNode;
}

// Provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          setAuthState({
            isAuthenticated: true,
            user: JSON.parse(storedUser),
            token,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            ...initialAuthState,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setAuthState({
          ...initialAuthState,
          loading: false,
        });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (data: LoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await authService.login(data);
      
      // Save token and user to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Login failed',
      }));
    }
  };

  // Register function
  const register = async (data: RegisterRequest) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await authService.register(data);
      
      // Save token and user to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Register error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Registration failed',
      }));
    }
  };

  // Guest login function
  const guestLogin = async (data: GuestLoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await authService.guestLogin(data);
      
      // Save guest info to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.guestId,
        displayName: response.displayName,
        isGuest: true,
      }));
      
      setAuthState({
        isAuthenticated: true,
        user: {
          id: response.guestId,
          displayName: response.displayName,
          isGuest: true,
        } as User,
        token: response.token,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Guest login error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Guest login failed',
      }));
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setAuthState({
      ...initialAuthState,
      loading: false,
    });
  };

  // Clear errors
  const clearErrors = () => {
    setAuthState(prev => ({
      ...prev,
      error: null,
    }));
  };

  // Context value
  const value = {
    authState,
    login,
    register,
    guestLogin,
    logout,
    clearErrors,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 