import React from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Container from '../../components/layout/Container';
import FootballerCard from '../../components/game/FootballerCard';
import { GameMode, Footballer } from '../../types/game';

interface GameOverScreenProps {
  isWinner: boolean;
  gameMode: GameMode;
  totalTurns: number;
  secretFootballer?: Footballer;
  opponentSecretFootballer?: Footballer;
  playTime: number; // in seconds
  onPlayAgain: () => void;
  onReturnHome: () => void;
  isRematchRequested?: boolean;
  isWaitingForOpponent?: boolean;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  isWinner,
  gameMode,
  totalTurns,
  secretFootballer,
  opponentSecretFootballer,
  playTime,
  onPlayAgain,
  onReturnHome,
  isRematchRequested = false,
  isWaitingForOpponent = false,
}) => {
  // Format play time
  const formatPlayTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          {isWinner ? (
            <span className="text-[#28A745]">You Won!</span>
          ) : (
            <span className="text-[#D62839]">You Lost!</span>
          )}
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Game completed in {formatPlayTime(playTime)}
        </p>
        <p className="text-lg text-gray-600">
          Total turns: {totalTurns}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Secret footballers reveal */}
        <Card className="p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Your Secret Footballer</h2>
          {secretFootballer ? (
            <div className="flex flex-col items-center">
              <FootballerCard
                id={secretFootballer.id}
                name={secretFootballer.name}
                imageUrl={secretFootballer.image}
                position={secretFootballer.position}
                size="large"
              />
              <p className="mt-4 text-lg font-medium">{secretFootballer.name}</p>
              <p className="text-gray-600">{secretFootballer.position} | {secretFootballer.club}</p>
            </div>
          ) : (
            <p className="text-gray-500">Footballer information not available</p>
          )}
        </Card>

        {gameMode === GameMode.MULTI_PLAYER && (
          <Card className="p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Opponent's Secret Footballer</h2>
            {opponentSecretFootballer ? (
              <div className="flex flex-col items-center">
                <FootballerCard
                  id={opponentSecretFootballer.id}
                  name={opponentSecretFootballer.name}
                  imageUrl={opponentSecretFootballer.image}
                  position={opponentSecretFootballer.position}
                  size="large"
                />
                <p className="mt-4 text-lg font-medium">{opponentSecretFootballer.name}</p>
                <p className="text-gray-600">{opponentSecretFootballer.position} | {opponentSecretFootballer.club}</p>
              </div>
            ) : (
              <p className="text-gray-500">Footballer information not available</p>
            )}
          </Card>
        )}
      </div>

      {/* Game stats */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Game Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Game Mode</p>
            <p className="text-lg font-bold">{gameMode === GameMode.SINGLE_PLAYER ? 'Singleplayer' : 'Multiplayer'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Play Time</p>
            <p className="text-lg font-bold">{formatPlayTime(playTime)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Turns</p>
            <p className="text-lg font-bold">{totalTurns}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Result</p>
            <p className={`text-lg font-bold ${isWinner ? 'text-[#28A745]' : 'text-[#D62839]'}`}>
              {isWinner ? 'Victory' : 'Defeat'}
            </p>
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="primary"
          onClick={onPlayAgain}
          isLoading={isRematchRequested && isWaitingForOpponent}
          disabled={isRematchRequested && isWaitingForOpponent}
        >
          {isRematchRequested && isWaitingForOpponent
            ? 'Waiting for Opponent...'
            : isRematchRequested
            ? 'Play Again'
            : 'Play Again'
          }
        </Button>
        <Button variant="secondary" onClick={onReturnHome}>
          Return to Home
        </Button>
      </div>
    </Container>
  );
};

export default GameOverScreen; 