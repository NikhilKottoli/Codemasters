import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Timer, BarChart2, Brain } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { FullQuestionProps,getDifficultyColor } from '@/types/question';



const QuestionCard: React.FC<FullQuestionProps> = ({
  title,
  description,
  difficulty,
  category,
  timeLimit,
  acceptance,
  example_input,
  expected_output,
  constraint_data,
}) => {
   
  const [input, setInput] = React.useState(example_input);
  const [output, setOutput] = React.useState(expected_output);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow  min-h-[90%] w-full max-w-md">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="text-gray-600 mb-6 h-auto overflow-visible break-words">
          {description}
        </div>

      <div className="flex flex-col gap-4 mb-4">
        <Badge className={`${getDifficultyColor(difficulty)} text-white text-sm min-w-auto max-w-[30%] px-3 py-1`}>{difficulty}</Badge>
        <div className="text-xs flex flex-col text-gray-500 space-y-1">
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


      <div className='mb-4'>
        <h3 className="font-semibold text-sm mb-4">Constraints:</h3>
        <div className="bg-gray-100 p-2 rounded-md text-xs overflow-y-auto max-h-32 whitespace-pre-wrap">
          {constraint_data}
        </div>
      </div>

      <div className="space-y-2">
      <h3 className="font-semibold text-sm">Example:</h3>
      <div className="bg-gray-100 p-2 rounded-md text-xs">
        <h3 className='py-4'>Input:</h3>
        <Textarea
          className="w-full mt-1"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        />
        <h3 className='py-4'>Output:</h3>
        <Textarea
          className="w-full mt-1"
          value={output}
          onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setOutput(e.target.value)}
        />
      </div>
    </div>

     
    </div>
  );
};

export default QuestionCard;