import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Container from '../../components/layout/Container';
import FootballerGrid from './FootballerGrid';
import QuestionSelector from '../questions/QuestionSelector';
import QuestionHistory from '../questions/QuestionHistory';
import { Footballer, GameMode, GameRoom, Question } from '../../types/game';

interface GameBoardProps {
  gameRoom: GameRoom;
  footballers: Footballer[];
  questions: Question[];
  currentPlayerId: string;
  onAskQuestion: (questionId: string) => void;
  onAnswer: (answer: boolean) => void;
  onMakeGuess: (footballerId: string) => void;
  isWaitingForAnswer: boolean;
  pendingQuestion?: Question;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameRoom,
  footballers,
  questions,
  currentPlayerId,
  onAskQuestion,
  onAnswer,
  onMakeGuess,
  isWaitingForAnswer,
  pendingQuestion,
}) => {
  const [isGuessingMode, setIsGuessingMode] = useState(false);
  const [selectedFootballerId, setSelectedFootballerId] = useState<string | undefined>(undefined);

  // Find current player and opponent from game room
  const currentPlayer = gameRoom.players.find(player => player.sessionId === currentPlayerId);
  const opponent = gameRoom.players.find(player => player.sessionId !== currentPlayerId);

  if (!currentPlayer || !opponent) {
    return <div>Unable to find player information.</div>;
  }

  const isMyTurn = currentPlayer.isTurn;
  const askedQuestionIds = currentPlayer.askedQuestions || [];
  const eliminatedIds = currentPlayer.eliminatedIds || [];

  const handleCardClick = (footballerId: string) => {
    if (isGuessingMode) {
      setSelectedFootballerId(footballerId);
    }
  };

  const remainingFootballers = footballers.filter(f => !eliminatedIds.includes(f.id)).length;

  return (
    <Container maxWidth="xl" className="py-4">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div>
          <h1 className="text-xl font-bold">Football Guess Who Game</h1>
          <p>Room ID: {gameRoom.roomId}</p>
        </div>
        
        <div>
          <p>Footballers Remaining: {remainingFootballers}</p>
          <p>Questions Remaining: {gameRoom.settings.maxQuestions - askedQuestionIds.length}</p>
          <p>{isMyTurn ? 'Your Turn' : `${opponent.displayName}'s Turn`}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main game board grid */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <h2 className="text-xl font-bold mb-4">Game Board</h2>
            <FootballerGrid
              footballers={footballers}
              eliminatedIds={eliminatedIds}
              selectedId={selectedFootballerId}
              onCardClick={handleCardClick}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="p-4 mb-4">
            {isMyTurn ? (
              <div>
                <h2 className="text-xl font-bold">Your Turn</h2>
                <div className="mt-4">
                  <Button 
                    variant="primary" 
                    onClick={() => setIsGuessingMode(false)}
                    className="mr-2"
                  >
                    Ask Question
                  </Button>
                  <Button 
                    variant="gameAction" 
                    onClick={() => setIsGuessingMode(true)}
                  >
                    Make Guess
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold">Opponent's Turn</h2>
                <p>Waiting for {opponent.displayName} to play...</p>
              </div>
            )}
          </Card>

          <Card className="p-4">
            {isMyTurn && !isGuessingMode ? (
              <QuestionSelector
                questions={questions}
                onSelectQuestion={onAskQuestion}
                askedQuestionIds={askedQuestionIds}
                isMyTurn={isMyTurn}
              />
            ) : (
              <QuestionHistory
                turnHistory={gameRoom.turnHistory}
                questions={questions}
                players={gameRoom.players.map(p => ({ id: p.sessionId, displayName: p.displayName }))}
                currentPlayerId={currentPlayerId}
              />
            )}
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default GameBoard; 