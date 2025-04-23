// User Types
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  gamesPlayed: number;
  gamesWon: number;
  createdAt: Date;
  updatedAt: Date;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface GuestLoginRequest {
  displayName: string;
}

export interface GuestLoginResponse {
  guestId: string;
  displayName: string;
  token: string;
} 