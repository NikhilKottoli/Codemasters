import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from './Editor';
import ActionBar from './ActionBar';
import QuestionCard from './QuestionCard';
import { TaskResult, createTask } from '../types/Task';
import { FullQuestionProps } from '@/types/question';
import { useQuestion,useSetQuestion } from '@/contexts/questionContext/useQuestion';

const TaskFetcher = () => {
  const { questionId } = useParams();
  const [code, setCode] = useState('// Start coding here...');
  const [language, setLanguage] = useState('js');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const userid = localStorage.getItem('token');

  // Fetch question details from the API using questionId
  const question= useQuestion();
  const setQuestion = useSetQuestion();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/question/${questionId}`);
        console.log(response.data);
        setQuestion(response.data);
      } catch (error) {
        setError('Failed to fetch question');
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  const pollTaskResult = async (taskId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/task/${taskId}`);
      const data: TaskResult = response.data;

      if (data.status === 'completed' && data.output) {
        // console.log(result, question.expected_output);
        setResult(data.output);
        setIsPolling(false);
        setIsLoading(false);
      } else if (data.status === 'failed') {
        setError('Task processing failed');
        setIsPolling(false);
        setIsLoading(false);
      } else {
        setTimeout(() => pollTaskResult(taskId), 500);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setTimeout(() => pollTaskResult(taskId), 500);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch result');
        setIsPolling(false);
        setIsLoading(false);
      }
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleAction = async (actionType: 'run' | 'submit') => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const task = createTask({
        code,
        language,
        questionId
      });

      if(actionType === 'run'){
        const response = await axios.post(
          'http://localhost:3000/task',
          {
            ...task,
            action: actionType,
            userId: userid,
            input: question.example_input,
            output: question.expected_output

          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setIsPolling(true);
        pollTaskResult(task.taskId);
        return;
      }
      else if(actionType === 'submit'){

      const response = await axios.post(
        'http://localhost:3000/task',
        {
          ...task,
          action: actionType,
          userId: userid
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setIsPolling(true);
      pollTaskResult(task.taskId);
      return;
    }} catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${actionType} code`);
      setIsLoading(false);
    }
  };

  const normalizeString = (str:string) => {
    return str
      .trim() 
      .replace(/\s+/g, ' ') 
      .replace(/\n+/g, '\n')
      .replace(/\n/g, ' ')  
  };
  

  if (!question) {
    return <div className="p-8 text-center">Question not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-900 text-white p-4">
        <h1 className="text-xl font-bold">IEEE Code Platform</h1>
      </nav>
      <div className="container mx-auto p-4">
        <div className="flex gap-10">
          <div className="w-[30%]">
            <QuestionCard
              title={question.title}
              description={question.description}
              difficulty={question.difficulty}
              category={question.category}
              timeLimit={question.timeLimit}
              acceptance={question.acceptance}
              example_input={question.example_input}
              expected_output={question.expected_output}
              constraint_data={question.constraint_data}
            />
          </div>
          <div className="w-[70%]">
            <Editor
              code={code}
              setCode={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
            />
            <ActionBar
              onRun={() => handleAction('run')}
              onSubmit={() => handleAction('submit')}
              isLoading={isLoading}
            />
            {isPolling && (
              <div className="mt-4 p-4 bg-blue-100 border border-blue-500 rounded-lg shadow">
                <p className="flex items-center">
                  <span className="animate-spin mr-2">⌛</span>
                  Processing your code...
                </p>
              </div>
            )}
            {result && (
              <div
                className={`mt-4 p-6 border rounded-lg shadow ${normalizeString(result) ===normalizeString( question.expected_output) ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
              >
                
                <h2
                  className={`font-bold text-lg ${normalizeString(result )=== normalizeString(question.expected_output) ? 'text-green-800' : 'text-red-800'} mb-2`}
                >
                  {normalizeString(result) === normalizeString(question.expected_output )? 'Correct' : 'Wrong'}
                </h2>
                <div className="bg-white p-4 rounded-md font-mono">
                  <pre className={`whitespace-pre-wrap ${normalizeString(result) === normalizeString(question.expected_output) ? 'text-green-900' : 'text-red-900'}`}>
                    {result}
                  </pre>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-6 bg-red-50 border border-red-500 rounded-lg shadow">
                <h2 className="font-bold text-lg text-red-800 mb-2">Error:</h2>
                <div className="bg-white p-4 rounded-md">
                  <p className="text-red-900">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFetcher;
