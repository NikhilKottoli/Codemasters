import {createContext, useState} from 'react';
import {FullQuestionProps} from '../../types/question';

export const QuestionContext = createContext<FullQuestionProps|undefined>(undefined);

export const SetQuestionContext = createContext<React.Dispatch<React.SetStateAction<FullQuestionProps|undefined>>|undefined>(undefined);

export const QuestionProvider = ({children}:{children:React.ReactNode}) => {
  const [question, setQuestion] = useState<FullQuestionProps|undefined>(undefined);

  return (
    <QuestionContext.Provider value={question}>
      <SetQuestionContext.Provider value={setQuestion}>
      {children}
      </SetQuestionContext.Provider>
    </QuestionContext.Provider>
  );
}