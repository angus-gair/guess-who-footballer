import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSocket } from './SocketContext';
import { useUser } from './UserContext';
import { gameService } from '../services/api';
import {
  GameRoom,
  Footballer,
  Question,
  PlayerSession,
  GameState,
  GameMode,
  Difficulty,
  CreateGameRequest,
  JoinGameRequest,
  AskQuestionRequest,
  AnswerQuestionRequest,
  MakeGuessRequest,
  RematchRequest
} from '../types/game';
import {
  SocketEvent,
  GameStartedPayload,
  RoomCreatedPayload,
  RoomJoinedPayload,
  PlayerJoinedPayload,
  PlayerLeftPayload,
  GameStateUpdatePayload,
  TurnChangePayload,
  QuestionAskedPayload,
  QuestionAnsweredPayload,
  GuessMadePayload,
  GuessResultPayload,
  CardEliminationPayload,
  GameOverPayload,
  RematchRequestedPayload,
  RematchAcceptedPayload
} from '../types/socket';

// Define the Game Context type
interface GameContextType {
  // Game state
  gameRoom: GameRoom | null;
  footballers: Footballer[];
  availableQuestions: Question[];
  currentPlayer: PlayerSession | null;
  isMyTurn: boolean;
  secretFootballer: Footballer | null;
  loading: boolean;
  error: string | null;
  
  // Room creation and joining
  createGame: (data: CreateGameRequest) => Promise<string>;
  joinGame: (data: JoinGameRequest) => Promise<void>;
  leaveGame: () => void;
  
  // Game actions
  askQuestion: (questionId: string) => Promise<void>;
  answerQuestion: (answer: boolean) => Promise<void>;
  makeGuess: (footballerId: string) => Promise<void>;
  requestRematch: (wantsRematch: boolean) => Promise<void>;

  // Game state helpers
  getMyEliminatedIds: () => string[];
  getOpponentEliminatedIds: () => string[];
}

// Create context with default values
const GameContext = createContext<GameContextType | undefined>(undefined);

// Props type for provider component
interface GameProviderProps {
  children: ReactNode;
}

// Provider component
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Game state
  const [gameRoom, setGameRoom] = useState<GameRoom | null>(null);
  const [footballers, setFootballers] = useState<Footballer[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [secretFootballer, setSecretFootballer] = useState<Footballer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get socket and user contexts
  const { connected, emit, on, off } = useSocket();
  const { authState } = useUser();

  // Get current player from game room
  const currentPlayer = gameRoom?.players.find(
    (player) => player.sessionId === authState.user?.id
  ) || null;

  // Check if it's my turn
  const isMyTurn = currentPlayer?.isTurn || false;

  // Clear error
  const clearError = () => setError(null);

  // Create a new game
  const createGame = async (data: CreateGameRequest): Promise<string> => {
    if (!connected) {
      throw new Error('Socket not connected');
    }

    try {
      setLoading(true);
      clearError();

      const response = await gameService.createGame(data);
      
      return response.roomId;
    } catch (error: any) {
      console.error('Create game error:', error);
      setError(error.message || 'Failed to create game');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Join an existing game
  const joinGame = async (data: JoinGameRequest): Promise<void> => {
    if (!connected) {
      throw new Error('Socket not connected');
    }

    try {
      setLoading(true);
      clearError();

      await gameService.joinGame(data);
    } catch (error: any) {
      console.error('Join game error:', error);
      setError(error.message || 'Failed to join game');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Leave the current game
  const leaveGame = (): void => {
    if (gameRoom && connected) {
      emit(SocketEvent.LEAVE_ROOM, { roomId: gameRoom.roomId });
      
      // Reset game state
      setGameRoom(null);
      setFootballers([]);
      setAvailableQuestions([]);
      setSecretFootballer(null);
      clearError();
    }
  };

  // Ask a question
  const askQuestion = async (questionId: string): Promise<void> => {
    if (!gameRoom || !connected || !isMyTurn) {
      throw new Error('Cannot ask question at this time');
    }

    try {
      setLoading(true);
      clearError();

      const data: AskQuestionRequest = {
        roomId: gameRoom.roomId,
        questionId,
      };

      await gameService.askQuestion(data);
    } catch (error: any) {
      console.error('Ask question error:', error);
      setError(error.message || 'Failed to ask question');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Answer a question
  const answerQuestion = async (answer: boolean): Promise<void> => {
    if (!gameRoom || !connected || isMyTurn) {
      throw new Error('Cannot answer question at this time');
    }

    try {
      setLoading(true);
      clearError();

      const data: AnswerQuestionRequest = {
        roomId: gameRoom.roomId,
        answer,
      };

      await gameService.answerQuestion(data);
    } catch (error: any) {
      console.error('Answer question error:', error);
      setError(error.message || 'Failed to answer question');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Make a guess
  const makeGuess = async (footballerId: string): Promise<void> => {
    if (!gameRoom || !connected || !isMyTurn) {
      throw new Error('Cannot make guess at this time');
    }

    try {
      setLoading(true);
      clearError();

      const data: MakeGuessRequest = {
        roomId: gameRoom.roomId,
        footballerId,
      };

      await gameService.makeGuess(data);
    } catch (error: any) {
      console.error('Make guess error:', error);
      setError(error.message || 'Failed to make guess');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Request a rematch
  const requestRematch = async (wantsRematch: boolean): Promise<void> => {
    if (!gameRoom || !connected) {
      throw new Error('Cannot request rematch at this time');
    }

    try {
      setLoading(true);
      clearError();

      const data: RematchRequest = {
        roomId: gameRoom.roomId,
        wantsRematch,
      };

      await gameService.requestRematch(data);
    } catch (error: any) {
      console.error('Request rematch error:', error);
      setError(error.message || 'Failed to request rematch');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get my eliminated footballer IDs
  const getMyEliminatedIds = (): string[] => {
    return currentPlayer?.eliminatedIds || [];
  };

  // Get opponent eliminated footballer IDs
  const getOpponentEliminatedIds = (): string[] => {
    const opponent = gameRoom?.players.find(
      (player) => player.sessionId !== authState.user?.id
    );
    return opponent?.eliminatedIds || [];
  };

  // Set up socket event listeners
  useEffect(() => {
    if (connected) {
      // Room created event
      on<RoomCreatedPayload>(SocketEvent.ROOM_CREATED, (data) => {
        setGameRoom(data.gameRoom);
      });

      // Room joined event
      on<RoomJoinedPayload>(SocketEvent.ROOM_JOINED, (data) => {
        setGameRoom(data.gameRoom);
      });

      // Player joined event
      on<PlayerJoinedPayload>(SocketEvent.PLAYER_JOINED, (data) => {
        setGameRoom(data.gameRoom);
      });

      // Player left event
      on<PlayerLeftPayload>(SocketEvent.PLAYER_LEFT, (data) => {
        setGameRoom(data.gameRoom);
      });

      // Game started event
      on<GameStartedPayload>(SocketEvent.GAME_STARTED, (data) => {
        setGameRoom(data.gameRoom);
        setFootballers(data.footballers);
        setAvailableQuestions(data.availableQuestions);
        
        // Find secret footballer
        const myPlayer = data.gameRoom.players.find(
          player => player.sessionId === authState.user?.id
        );
        
        if (myPlayer) {
          const secret = data.footballers.find(
            footballer => footballer.id === myPlayer.secretId
          ) || null;
          
          setSecretFootballer(secret);
        }
      });

      // Game state update event
      on<GameStateUpdatePayload>(SocketEvent.GAME_STATE_UPDATE, (data) => {
        setGameRoom(data.gameRoom);
      });

      // Question asked event
      on<QuestionAskedPayload>(SocketEvent.QUESTION_ASKED, (data) => {
        // Update game state based on question asked
      });

      // Question answered event
      on<QuestionAnsweredPayload>(SocketEvent.QUESTION_ANSWERED, (data) => {
        // Update eliminated cards based on answer
      });

      // Card elimination event
      on<CardEliminationPayload>(SocketEvent.CARD_ELIMINATION, (data) => {
        setGameRoom(prev => {
          if (!prev) return prev;
          
          // Find the player and update their eliminated IDs
          const updatedPlayers = prev.players.map(player => {
            if (player.sessionId === data.playerId) {
              return {
                ...player,
                eliminatedIds: data.eliminatedIds
              };
            }
            return player;
          });
          
          return {
            ...prev,
            players: updatedPlayers
          };
        });
      });

      // Game over event
      on<GameOverPayload>(SocketEvent.GAME_OVER, (data) => {
        setGameRoom(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            state: GameState.FINISHED,
            winnerId: data.winnerId
          };
        });
        
        // Set secret footballer if it was revealed
        if (data.secretFootballer) {
          setSecretFootballer(data.secretFootballer);
        }
      });

      // Rematch requested event
      on<RematchRequestedPayload>(SocketEvent.REMATCH_REQUESTED, (data) => {
        setGameRoom(prev => {
          if (!prev) return prev;
          
          // Update player's rematch status
          const updatedPlayers = prev.players.map(player => {
            if (player.sessionId === data.playerId) {
              return {
                ...player,
                wantsRematch: data.wantsRematch
              };
            }
            return player;
          });
          
          return {
            ...prev,
            players: updatedPlayers
          };
        });
      });

      // Rematch accepted event
      on<RematchAcceptedPayload>(SocketEvent.REMATCH_ACCEPTED, (data) => {
        setGameRoom(data.gameRoom);
      });

      // Clean up event listeners on unmount
      return () => {
        off(SocketEvent.ROOM_CREATED);
        off(SocketEvent.ROOM_JOINED);
        off(SocketEvent.PLAYER_JOINED);
        off(SocketEvent.PLAYER_LEFT);
        off(SocketEvent.GAME_STARTED);
        off(SocketEvent.GAME_STATE_UPDATE);
        off(SocketEvent.QUESTION_ASKED);
        off(SocketEvent.QUESTION_ANSWERED);
        off(SocketEvent.CARD_ELIMINATION);
        off(SocketEvent.GAME_OVER);
        off(SocketEvent.REMATCH_REQUESTED);
        off(SocketEvent.REMATCH_ACCEPTED);
      };
    }
  }, [connected, authState.user?.id]);

  // Context value
  const value: GameContextType = {
    gameRoom,
    footballers,
    availableQuestions,
    currentPlayer,
    isMyTurn,
    secretFootballer,
    loading,
    error,
    createGame,
    joinGame,
    leaveGame,
    askQuestion,
    answerQuestion,
    makeGuess,
    requestRematch,
    getMyEliminatedIds,
    getOpponentEliminatedIds,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext; 