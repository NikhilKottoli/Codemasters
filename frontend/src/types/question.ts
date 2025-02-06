export interface FullQuestionProps {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    timeLimit: string;
    acceptance: string;
    example_input: string;
    expected_output: string;
    constraint_data: string;
  }



export interface QuestionCardProps{
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
  }


  export const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
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