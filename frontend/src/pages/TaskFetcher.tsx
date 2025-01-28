import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from './Editor';
import ActionBar from './ActionBar';
import QuestionCard from './QuestionCard';
import { Task, createTask } from '../types/Task';

interface TaskResult {
  taskId: string;
  status: 'pending' | 'completed' | 'failed';
  output?: string;
  completedAt?: string;
  userId: string;
}

const TaskFetcher = () => {
    const [code, setCode] = useState('// Start coding here...');
    const [language, setLanguage] = useState('js');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const userid = localStorage.getItem('token');

    const pollTaskResult = async (taskId: string) => {
    try {
        const response = await axios.get(`http://localhost:3000/task/${taskId}`);
        const data: TaskResult = response.data;

        if (data.status === 'completed' && data.output) {
        setResult(data.output);
        setIsPolling(false);
        setIsLoading(false);
        } else if (data.status === 'failed') {
        setError('Task processing failed');
        setIsPolling(false);
        setIsLoading(false);
        } else {
        // Continue polling if still pending, but add a small backoff time
        setTimeout(() => pollTaskResult(taskId), 500);  // Try again after 500ms
        }
    } catch (err) {
        if (err.response?.status === 404) {
        // If we get a 404 (not found), it might just be the task is not yet available,
        // so wait a bit and retry.
        setTimeout(() => pollTaskResult(taskId), 500);  // Retry after 500ms
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
      // First create task
      const task = createTask({
        code,
        language
      });

      // Then send the task for execution
      const response = await axios.post(
        'http://localhost:3000/task',
        {
          ...task,
          action: actionType,
          userId: userid // Sending the userId along with the task
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Start polling for results using the new taskId
      setIsPolling(true);
      pollTaskResult(task.taskId);
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${actionType} code`);
      setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-900 text-white p-4">
        <h1 className="text-xl font-bold">IEEE Code Platform</h1>
      </nav>
      <div className="container mx-auto p-4">
        <div className="flex gap-10">
          <div className="col-span-1 w-[20%]">
            <QuestionCard />
          </div>
          <div className="col-span-2 w-[70%]">
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
              <div className="mt-4 p-4 bg-blue-100 border border-blue-500 rounded">
                <p className="flex items-center">
                  <span className="animate-spin mr-2">⌛</span>
                  Processing your code...
                </p>
              </div>
            )}
            {result && (
              <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded">
                <h2 className="font-bold text-lg">Result:</h2>
                <pre className="whitespace-pre-wrap">{result}</pre>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-500 rounded">
                <h2 className="font-bold text-lg text-red-700">Error:</h2>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFetcher;