-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GK', 'DEF', 'MID', 'FWD');

-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('SP', 'MP');

-- CreateEnum
CREATE TYPE "GameState" AS ENUM ('WAITING', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "GameSubState" AS ENUM ('WAITING_FOR_ANSWER', 'PENDING_REMATCH');

-- CreateEnum
CREATE TYPE "TurnType" AS ENUM ('QUESTION', 'GUESS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footballers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "nation" TEXT NOT NULL,
    "position" "Position" NOT NULL,
    "ageBracket" TEXT NOT NULL,
    "hairColor" TEXT NOT NULL,
    "facialHair" BOOLEAN NOT NULL,
    "bootsColor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footballers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_rooms" (
    "id" TEXT NOT NULL,
    "roomCode" TEXT NOT NULL,
    "mode" "GameMode" NOT NULL,
    "state" "GameState" NOT NULL,
    "subState" "GameSubState",
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "winnerId" TEXT,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_sessions" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "isHuman" BOOLEAN NOT NULL,
    "isTurn" BOOLEAN NOT NULL,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wantsRematch" BOOLEAN NOT NULL DEFAULT false,
    "remainingGuesses" INTEGER NOT NULL,
    "userId" TEXT,
    "gameRoomId" TEXT NOT NULL,
    "secretId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "trait" TEXT NOT NULL,
    "expectedValues" TEXT[],
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turn_records" (
    "id" TEXT NOT NULL,
    "playerSessionId" TEXT NOT NULL,
    "questionId" TEXT,
    "guessId" TEXT,
    "answer" BOOLEAN,
    "turnType" "TurnType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameRoomId" TEXT NOT NULL,

    CONSTRAINT "turn_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_statistics" (
    "id" TEXT NOT NULL,
    "totalTurns" INTEGER NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameRoomId" TEXT NOT NULL,
    "winnerId" TEXT,

    CONSTRAINT "game_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AskedQuestions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EliminatedFootballers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "game_rooms_roomCode_key" ON "game_rooms"("roomCode");

-- CreateIndex
CREATE UNIQUE INDEX "game_statistics_gameRoomId_key" ON "game_statistics"("gameRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "_AskedQuestions_AB_unique" ON "_AskedQuestions"("A", "B");

-- CreateIndex
CREATE INDEX "_AskedQuestions_B_index" ON "_AskedQuestions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EliminatedFootballers_AB_unique" ON "_EliminatedFootballers"("A", "B");

-- CreateIndex
CREATE INDEX "_EliminatedFootballers_B_index" ON "_EliminatedFootballers"("B");

-- AddForeignKey
ALTER TABLE "player_sessions" ADD CONSTRAINT "player_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_sessions" ADD CONSTRAINT "player_sessions_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "game_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_sessions" ADD CONSTRAINT "player_sessions_secretId_fkey" FOREIGN KEY ("secretId") REFERENCES "footballers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turn_records" ADD CONSTRAINT "turn_records_playerSessionId_fkey" FOREIGN KEY ("playerSessionId") REFERENCES "player_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turn_records" ADD CONSTRAINT "turn_records_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turn_records" ADD CONSTRAINT "turn_records_guessId_fkey" FOREIGN KEY ("guessId") REFERENCES "footballers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turn_records" ADD CONSTRAINT "turn_records_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "game_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_statistics" ADD CONSTRAINT "game_statistics_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "game_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AskedQuestions" ADD CONSTRAINT "_AskedQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "player_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AskedQuestions" ADD CONSTRAINT "_AskedQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EliminatedFootballers" ADD CONSTRAINT "_EliminatedFootballers_A_fkey" FOREIGN KEY ("A") REFERENCES "footballers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EliminatedFootballers" ADD CONSTRAINT "_EliminatedFootballers_B_fkey" FOREIGN KEY ("B") REFERENCES "player_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE; 