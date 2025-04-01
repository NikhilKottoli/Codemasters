export interface DSAQuestion {
    id: number;
    title: string;
    // Add other DSA question fields as needed
  }
  
 export  interface MCQQuestion {
    id: number;
    description: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer?: number;
  }
  
  export interface Contest {
    id: number;
    name: string;
    desc: string;
    questions: number[]; // Array of DSA question IDs
    MCQ: number[]; // Array of MCQ question IDs
    public: boolean;
    start_time: string;
    end_time: string;
  }