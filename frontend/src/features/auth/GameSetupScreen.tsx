import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Container from '../../components/layout/Container';
import { Difficulty, GameMode } from '../../types/game';

interface GameSetupScreenProps {
  gameMode: GameMode;
  onBack: () => void;
  onStartGame: (settings: GameSettings) => void;
  isCreatingGame?: boolean;
}

interface GameSettings {
  displayName: string;
  difficulty: Difficulty;
  turnTimeLimit: number | null;
  maxQuestions: number;
  roomCode?: string;
}

const GameSetupScreen: React.FC<GameSetupScreenProps> = ({
  gameMode,
  onBack,
  onStartGame,
  isCreatingGame = false,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [turnTimeLimit, setTurnTimeLimit] = useState<number | null>(30);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [roomCode, setRoomCode] = useState('');
  const [joinRoom, setJoinRoom] = useState(false);
  const [generateCode, setGenerateCode] = useState(true);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  const handleTurnTimeLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setTurnTimeLimit(isNaN(value) ? null : value);
  };

  const handleMaxQuestionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setMaxQuestions(isNaN(value) ? 10 : value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate form
    if (!displayName.trim()) {
      alert('Please enter a display name');
      return;
    }
    
    if (gameMode === GameMode.MULTI_PLAYER && joinRoom && !roomCode.trim()) {
      alert('Please enter a room code to join');
      return;
    }
    
    onStartGame({
      displayName: displayName.trim(),
      difficulty,
      turnTimeLimit,
      maxQuestions,
      roomCode: joinRoom ? roomCode.trim() : undefined,
    });
  };

  return (
    <Container maxWidth="md" className="py-8">
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="secondary" size="compact" onClick={onBack} className="mr-4">
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {gameMode === GameMode.SINGLE_PLAYER ? 'Singleplayer Setup' : 'Multiplayer Setup'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Display Name */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="displayName">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
              placeholder="Enter your name"
              required
            />
          </div>
          
          {/* Difficulty (Singleplayer only) */}
          {gameMode === GameMode.SINGLE_PLAYER && (
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant={difficulty === Difficulty.EASY ? 'primary' : 'secondary'}
                  onClick={() => handleDifficultyChange(Difficulty.EASY)}
                >
                  Easy
                </Button>
                <Button
                  type="button"
                  variant={difficulty === Difficulty.MEDIUM ? 'primary' : 'secondary'}
                  onClick={() => handleDifficultyChange(Difficulty.MEDIUM)}
                >
                  Medium
                </Button>
                <Button
                  type="button"
                  variant={difficulty === Difficulty.HARD ? 'primary' : 'secondary'}
                  onClick={() => handleDifficultyChange(Difficulty.HARD)}
                >
                  Hard
                </Button>
              </div>
            </div>
          )}
          
          {/* Room Code (Multiplayer only) */}
          {gameMode === GameMode.MULTI_PLAYER && (
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Room
              </label>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="createRoom"
                    checked={!joinRoom}
                    onChange={() => setJoinRoom(false)}
                    className="mr-2"
                  />
                  <label htmlFor="createRoom">Create a new room</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="joinRoom"
                    checked={joinRoom}
                    onChange={() => setJoinRoom(true)}
                    className="mr-2"
                  />
                  <label htmlFor="joinRoom">Join an existing room</label>
                </div>
                
                {joinRoom && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="roomCode">
                      Room Code
                    </label>
                    <input
                      type="text"
                      id="roomCode"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                      placeholder="Enter room code"
                      required={joinRoom}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Additional Options */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              Additional Options
            </label>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="turnTimeLimit">
                  Turn Time Limit: {turnTimeLimit === null ? 'No limit' : `${turnTimeLimit} seconds`}
                </label>
                <input
                  type="range"
                  id="turnTimeLimit"
                  min="10"
                  max="60"
                  step="5"
                  value={turnTimeLimit === null ? 30 : turnTimeLimit}
                  onChange={handleTurnTimeLimitChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>10s</span>
                  <span>60s</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="maxQuestions">
                  Max Questions: {maxQuestions}
                </label>
                <input
                  type="range"
                  id="maxQuestions"
                  min="5"
                  max="20"
                  value={maxQuestions}
                  onChange={handleMaxQuestionsChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5</span>
                  <span>20</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            isFullWidth
            isLoading={isCreatingGame}
            disabled={isCreatingGame}
            className="py-3 text-lg"
          >
            {isCreatingGame 
              ? (gameMode === GameMode.SINGLE_PLAYER ? 'Starting Game...' : joinRoom ? 'Joining Game...' : 'Creating Game...')
              : 'Start Game'
            }
          </Button>
        </form>
      </Card>
    </Container>
  );
};

export default GameSetupScreen; 