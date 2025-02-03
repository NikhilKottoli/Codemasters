import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Timer, BarChart2, Brain } from 'lucide-react';

interface QuestionCardProps {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeLimit: string;
  acceptance: string;
  exampleInput: string;
  expectedOutput: string;
  constraint_data: string;
}

const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-500';
    case 'Medium':
      return 'bg-yellow-500';
    case 'Hard':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  title,
  description,
  difficulty,
  category,
  timeLimit,
  acceptance,
  exampleInput,
  expectedOutput,
  constraint_data,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full max-w-md">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <pre className="text-gray-600 mb-4 text-sm overflow-y-auto">{description}</pre>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Badge className={`${getDifficultyColor(difficulty)} text-white text-sm px-3 py-1`}>{difficulty}</Badge>
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            <span>{timeLimit}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="w-4 h-4" />
            <span>{acceptance} acceptance</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            <span>{category}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-sm">Example:</h3>
        <div className="bg-gray-100 p-2 rounded-md text-xs whitespace-pre-wrap">
          <strong>Input:</strong>
          <pre className="overflow-x-auto">{exampleInput}</pre>
          <strong>Output:</strong>
          <pre className="overflow-x-auto">{expectedOutput}</pre>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm">Constraints:</h3>
        <div className="bg-gray-100 p-2 rounded-md text-xs overflow-y-auto max-h-32 whitespace-pre-wrap">
          {constraint_data}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;