import {createContext, useState, Dispatch, SetStateAction} from 'react';
import {FullQuestionProps} from '../../types/question';

export const QuestionContext = createContext<FullQuestionProps | null>(null);
export const SetQuestionContext = createContext<Dispatch<SetStateAction<FullQuestionProps | null>> | null>(null);

export const QuestionProvider = ({children}:{children:React.ReactNode}) => {
  const [question, setQuestion] = useState<FullQuestionProps | null>(null);

  return (
    <QuestionContext.Provider value={question}>
      <SetQuestionContext.Provider value={setQuestion}>
      {children}
      </SetQuestionContext.Provider>
    </QuestionContext.Provider> 
  );
}