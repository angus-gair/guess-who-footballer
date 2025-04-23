import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  CreateGameRequest, 
  JoinGameRequest, 
  AskQuestionRequest, 
  AnswerQuestionRequest, 
  MakeGuessRequest, 
  RematchRequest,
  GameRoom,
  Footballer,
  Question,
  GameStatistic
} from '../types/game';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  GuestLoginRequest,
  GuestLoginResponse,
  User
} from '../types/user';

// API base URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a custom axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication Service
export const authService = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response: AxiosResponse<RegisterResponse> = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Login with credentials
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Login as guest
  guestLogin: async (data: GuestLoginRequest): Promise<GuestLoginResponse> => {
    const response: AxiosResponse<GuestLoginResponse> = await apiClient.post('/auth/guest', data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<User> = await apiClient.get('/auth/profile');
    return response.data;
  },
};

// Game Service
export const gameService = {
  // Create a new game room
  createGame: async (data: CreateGameRequest): Promise<GameRoom> => {
    const response: AxiosResponse<GameRoom> = await apiClient.post('/games', data);
    return response.data;
  },

  // Join an existing game room
  joinGame: async (data: JoinGameRequest): Promise<GameRoom> => {
    const response: AxiosResponse<GameRoom> = await apiClient.post('/games/join', data);
    return response.data;
  },

  // Get all available questions
  getQuestions: async (): Promise<Question[]> => {
    const response: AxiosResponse<Question[]> = await apiClient.get('/questions');
    return response.data;
  },

  // Ask a question
  askQuestion: async (data: AskQuestionRequest): Promise<boolean> => {
    const response: AxiosResponse<boolean> = await apiClient.post('/games/question', data);
    return response.data;
  },

  // Answer a question
  answerQuestion: async (data: AnswerQuestionRequest): Promise<boolean> => {
    const response: AxiosResponse<boolean> = await apiClient.post('/games/answer', data);
    return response.data;
  },

  // Make a guess
  makeGuess: async (data: MakeGuessRequest): Promise<boolean> => {
    const response: AxiosResponse<boolean> = await apiClient.post('/games/guess', data);
    return response.data;
  },

  // Request a rematch
  requestRematch: async (data: RematchRequest): Promise<boolean> => {
    const response: AxiosResponse<boolean> = await apiClient.post('/games/rematch', data);
    return response.data;
  },

  // Get game statistics
  getStatistics: async (gameId: string): Promise<GameStatistic> => {
    const response: AxiosResponse<GameStatistic> = await apiClient.get(`/games/${gameId}/stats`);
    return response.data;
  },
};

// Footballer Service
export const footballerService = {
  // Get all footballers
  getFootballers: async (): Promise<Footballer[]> => {
    const response: AxiosResponse<Footballer[]> = await apiClient.get('/footballers');
    return response.data;
  },

  // Get a specific footballer
  getFootballer: async (id: string): Promise<Footballer> => {
    const response: AxiosResponse<Footballer> = await apiClient.get(`/footballers/${id}`);
    return response.data;
  },
};

export default apiClient; 