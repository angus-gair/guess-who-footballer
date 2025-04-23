// User related models and types

export interface User {
  id: string;
  email: string;
  password: string; // Hashed password, never returned to client
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  displayName: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserAuthResponse {
  user: UserPublic;
  accessToken: string;
  refreshToken: string;
} 