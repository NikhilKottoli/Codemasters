import { useContext } from "react";
import { QuestionContext,SetQuestionContext } from "./questionContext";

export const useQuestion = () => {
    const question = useContext(QuestionContext);
    
    if (question === undefined) {
        throw new Error("useQuestion must be used within a QuestionProvider");
    }
    
    return question;
    };

export const useSetQuestion = () => {
    const setQuestion= useContext(SetQuestionContext);
    if(setQuestion === undefined){
        throw new Error("useSetQuestion must be used within a QuestionProvider");
    }   
    return setQuestion;
    }