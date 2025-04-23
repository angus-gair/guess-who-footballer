import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Question } from '../../types/game';

// Group questions by category for better organization
const questionCategories = [
  'Appearance',
  'Team',
  'Personal',
  'Playing Style',
  'Career',
  'Performance'
];

interface QuestionSelectorProps {
  questions: Question[];
  onSelectQuestion: (questionId: string) => void;
  askedQuestionIds: string[];
  isMyTurn: boolean;
  isLoading?: boolean;
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  questions,
  onSelectQuestion,
  askedQuestionIds,
  isMyTurn,
  isLoading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group questions by their category
  const groupedQuestions = questions.reduce((acc, question) => {
    // Determine category based on the trait
    let category = 'Other';
    
    if (['hairColor', 'facialHair', 'bootsColor'].includes(question.trait)) {
      category = 'Appearance';
    } else if (['club', 'nation'].includes(question.trait)) {
      category = 'Team';
    } else if (['position'].includes(question.trait)) {
      category = 'Playing Style';
    } else if (['ageBracket'].includes(question.trait)) {
      category = 'Personal';
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  const isQuestionDisabled = (questionId: string) => {
    return askedQuestionIds.includes(questionId) || !isMyTurn;
  };

  const handleQuestionClick = (questionId: string) => {
    if (!isQuestionDisabled(questionId) && !isLoading) {
      onSelectQuestion(questionId);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#333333]">Ask a Question</h2>
      
      {/* Category selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {questionCategories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'secondary'}
            size="compact"
            onClick={() => setSelectedCategory(category)}
            disabled={!isMyTurn || !groupedQuestions[category] || groupedQuestions[category].length === 0}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {/* Question list */}
      {selectedCategory && groupedQuestions[selectedCategory] && (
        <div className="grid grid-cols-1 gap-2 mt-4">
          {groupedQuestions[selectedCategory].map((question) => {
            const isDisabled = isQuestionDisabled(question.id);
            
            return (
              <Card
                key={question.id}
                className={`p-3 transition-colors border ${
                  isDisabled
                    ? 'bg-gray-100 text-gray-500 border-gray-200'
                    : 'bg-white text-[#333333] border-[#0F4C81]/20 hover:border-[#0F4C81]'
                }`}
                interactive={!isDisabled}
                onClick={() => handleQuestionClick(question.id)}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{question.text}</p>
                  {askedQuestionIds.includes(question.id) && (
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">Asked</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      {!selectedCategory && (
        <div className="text-center py-4 text-gray-500">
          {isMyTurn ? 'Select a category to view questions' : 'Wait for your turn to ask questions'}
        </div>
      )}
      
      {selectedCategory && (!groupedQuestions[selectedCategory] || groupedQuestions[selectedCategory].length === 0) && (
        <div className="text-center py-4 text-gray-500">
          No questions available in this category
        </div>
      )}
    </div>
  );
};

export default QuestionSelector; 