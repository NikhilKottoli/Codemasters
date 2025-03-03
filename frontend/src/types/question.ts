export interface FullQuestionProps {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    timeLimit: string;
    acceptance: string;
    example_input: Record<string, string>;
    expected_output: Record<string, string>;
    selected_input: string|null;
    selected_output: string|null;
    constraint_data: string;
    visible_test_cases: string;
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