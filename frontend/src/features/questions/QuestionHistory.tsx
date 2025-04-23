import React from 'react';
import Card from '../../components/common/Card';
import { Question, TurnRecord } from '../../types/game';

interface QuestionHistoryProps {
  turnHistory: TurnRecord[];
  questions: Question[];
  players: {
    id: string;
    displayName: string;
  }[];
  currentPlayerId: string;
}

const QuestionHistory: React.FC<QuestionHistoryProps> = ({
  turnHistory,
  questions,
  players,
  currentPlayerId,
}) => {
  if (!turnHistory || turnHistory.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        No questions have been asked yet.
      </div>
    );
  }

  // Reverse the history to show most recent first
  const reversedHistory = [...turnHistory].reverse();

  const getQuestionText = (questionId?: string) => {
    if (!questionId) return 'Made a guess';
    const question = questions.find(q => q.id === questionId);
    return question ? question.text : 'Unknown question';
  };

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.displayName : 'Unknown player';
  };

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
      <h2 className="text-xl font-bold text-[#333333]">Question History</h2>
      
      {reversedHistory.map((turn, index) => {
        const isQuestion = !!turn.questionId;
        const isCurrentPlayer = turn.playerId === currentPlayerId;
        
        return (
          <Card
            key={`${turn.playerId}-${turn.timestamp}-${index}`}
            className={`p-3 border ${
              isCurrentPlayer ? 'border-[#0F4C81]/20' : 'border-gray-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${isCurrentPlayer ? 'text-[#0F4C81]' : 'text-gray-700'}`}>
                  {isCurrentPlayer ? 'You' : getPlayerName(turn.playerId)}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className="text-sm text-gray-700">{getQuestionText(turn.questionId)}</p>
              
              {isQuestion && turn.isCorrect !== undefined && (
                <div className={`text-sm px-2 py-1 rounded-full inline-block ${
                  turn.isCorrect
                    ? 'bg-[#28A745]/10 text-[#28A745]'
                    : 'bg-[#DC3545]/10 text-[#DC3545]'
                }`}>
                  {turn.isCorrect ? 'Yes' : 'No'}
                </div>
              )}
              
              {turn.guessId && (
                <div className={`text-sm px-2 py-1 rounded-full inline-block ${
                  turn.isCorrect
                    ? 'bg-[#28A745]/10 text-[#28A745]'
                    : 'bg-[#DC3545]/10 text-[#DC3545]'
                }`}>
                  {turn.isCorrect ? 'Correct Guess!' : 'Incorrect Guess'}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default QuestionHistory; 