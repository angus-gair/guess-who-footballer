import { 
  GameRoom, 
  PlayerSession, 
  TurnRecord, 
  GameState, 
  GameSettings, 
  GameMode, 
  GameSubState, 
  TurnType 
} from '../models';
import prisma from '../utils/prisma';
import { v4 as uuidv4 } from 'uuid';

/**
 * Game repository for database operations
 */
export class GameRepository {
  /**
   * Create a new game room
   * @param mode Game mode (SP/MP)
   * @param settings Game settings
   * @returns Created game room
   */
  async createGameRoom(mode: GameMode, settings: GameSettings): Promise<GameRoom> {
    // Generate a random 6-character alphanumeric code
    const roomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    return prisma.gameRoom.create({
      data: {
        roomCode,
        mode,
        state: GameState.WAITING,
        settings: settings as any,
      },
      include: {
        players: true,
        turnHistory: true,
      },
    });
  }

  /**
   * Find game room by ID
   * @param id Game room ID
   * @returns Game room if found, null otherwise
   */
  async findGameRoomById(id: string): Promise<GameRoom | null> {
    return prisma.gameRoom.findUnique({
      where: { id },
      include: {
        players: {
          include: {
            secretFootballer: true,
            eliminatedFootballers: true,
            askedQuestions: true,
          },
        },
        turnHistory: {
          include: {
            playerSession: true,
            question: true,
            guess: true,
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });
  }

  /**
   * Find game room by room code
   * @param roomCode Room code
   * @returns Game room if found, null otherwise
   */
  async findGameRoomByCode(roomCode: string): Promise<GameRoom | null> {
    return prisma.gameRoom.findUnique({
      where: { roomCode },
      include: {
        players: {
          include: {
            secretFootballer: true,
            eliminatedFootballers: true,
            askedQuestions: true,
          },
        },
        turnHistory: {
          include: {
            playerSession: true,
            question: true,
            guess: true,
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });
  }

  /**
   * Update game room
   * @param id Game room ID
   * @param data Game room data to update
   * @returns Updated game room
   */
  async updateGameRoom(id: string, data: Partial<GameRoom>): Promise<GameRoom> {
    // Extract non-relation fields
    const {
      players,
      turnHistory,
      ...updateData
    } = data;

    return prisma.gameRoom.update({
      where: { id },
      data: updateData as any,
      include: {
        players: {
          include: {
            secretFootballer: true,
            eliminatedFootballers: true,
            askedQuestions: true,
          },
        },
        turnHistory: {
          include: {
            playerSession: true,
            question: true,
            guess: true,
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });
  }

  /**
   * Create a new player session
   * @param gameRoomId Game room ID
   * @param displayName Display name
   * @param isHuman Is human player
   * @param secretId Secret footballer ID
   * @param userId User ID (optional)
   * @returns Created player session
   */
  async createPlayerSession(
    gameRoomId: string,
    displayName: string,
    isHuman: boolean,
    secretId: string,
    userId?: string,
  ): Promise<PlayerSession> {
    return prisma.playerSession.create({
      data: {
        displayName,
        isHuman,
        isTurn: false,
        wantsRematch: false,
        remainingGuesses: 1,
        gameRoom: {
          connect: { id: gameRoomId },
        },
        secretFootballer: {
          connect: { id: secretId },
        },
        ...(userId && {
          user: {
            connect: { id: userId },
          },
        }),
      },
      include: {
        secretFootballer: true,
        eliminatedFootballers: true,
        askedQuestions: true,
      },
    });
  }

  /**
   * Update player session
   * @param id Player session ID
   * @param data Player session data to update
   * @returns Updated player session
   */
  async updatePlayerSession(id: string, data: Partial<PlayerSession>): Promise<PlayerSession> {
    // Extract non-relation fields
    const {
      eliminatedFootballers,
      askedQuestions,
      ...updateData
    } = data;

    const updateOperation = prisma.playerSession.update({
      where: { id },
      data: updateData as any,
      include: {
        secretFootballer: true,
        eliminatedFootballers: true,
        askedQuestions: true,
      },
    });

    // Connect/disconnect relationships if needed
    if (eliminatedFootballers) {
      // This is simplified; in reality, you'd need to compare existing relationships
      // and determine which to connect or disconnect
      // This would be done with a transaction
    }

    if (askedQuestions) {
      // Similar to above
    }

    return updateOperation;
  }

  /**
   * Add eliminated footballer to player session
   * @param playerSessionId Player session ID
   * @param footballerId Footballer ID
   * @returns Updated player session
   */
  async addEliminatedFootballer(playerSessionId: string, footballerId: string): Promise<PlayerSession> {
    return prisma.playerSession.update({
      where: { id: playerSessionId },
      data: {
        eliminatedFootballers: {
          connect: { id: footballerId },
        },
      },
      include: {
        secretFootballer: true,
        eliminatedFootballers: true,
        askedQuestions: true,
      },
    });
  }

  /**
   * Add asked question to player session
   * @param playerSessionId Player session ID
   * @param questionId Question ID
   * @returns Updated player session
   */
  async addAskedQuestion(playerSessionId: string, questionId: string): Promise<PlayerSession> {
    return prisma.playerSession.update({
      where: { id: playerSessionId },
      data: {
        askedQuestions: {
          connect: { id: questionId },
        },
      },
      include: {
        secretFootballer: true,
        eliminatedFootballers: true,
        askedQuestions: true,
      },
    });
  }

  /**
   * Create a new turn record
   * @param gameRoomId Game room ID
   * @param playerSessionId Player session ID
   * @param turnType Turn type
   * @param questionId Question ID (optional)
   * @param guessId Guess ID (optional)
   * @param answer Answer (optional)
   * @returns Created turn record
   */
  async createTurnRecord(
    gameRoomId: string,
    playerSessionId: string,
    turnType: TurnType,
    questionId?: string,
    guessId?: string,
    answer?: boolean,
  ): Promise<TurnRecord> {
    return prisma.turnRecord.create({
      data: {
        gameRoom: {
          connect: { id: gameRoomId },
        },
        playerSession: {
          connect: { id: playerSessionId },
        },
        turnType,
        ...(questionId && {
          question: {
            connect: { id: questionId },
          },
        }),
        ...(guessId && {
          guess: {
            connect: { id: guessId },
          },
        }),
        answer,
      },
      include: {
        playerSession: true,
        question: true,
        guess: true,
      },
    });
  }

  /**
   * Create game statistics
   * @param gameRoomId Game room ID
   * @param totalTurns Total turns
   * @param questionCount Question count
   * @param duration Duration in seconds
   * @param winnerId Winner ID (optional)
   * @returns Created game statistics
   */
  async createGameStatistics(
    gameRoomId: string,
    totalTurns: number,
    questionCount: number,
    duration: number,
    winnerId?: string,
  ) {
    return prisma.gameStatistic.create({
      data: {
        gameRoom: {
          connect: { id: gameRoomId },
        },
        totalTurns,
        questionCount,
        duration,
        winnerId,
      },
    });
  }
} 