import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '@/config';

import {DSAQuestion,MCQQuestion,Contest} from '../types/contest'
const ContestQuestionsEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State for data
  const [contest, setContest] = useState<Contest | null>(null);
  const [dsaQuestions, setDsaQuestions] = useState<DSAQuestion[]>([]);
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [selectedDsaIds, setSelectedDsaIds] = useState<number[]>([]);
  const [selectedMcqIds, setSelectedMcqIds] = useState<number[]>([]);
  
  // State for UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dsa' | 'mcq'>('dsa');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Fetch contest data
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`${config.HOST}/contests/${id}`);
        console.log(response);
        const contestData = response.data[0];
        setContest(contestData);
        
        // Initialize selected questions from contest data
        if (contestData.questions) {
          setSelectedDsaIds(
            Array.isArray(contestData.questions) 
              ? contestData.questions 
              : JSON.parse(contestData.questions)
          );
        }
        
        if (contestData.MCQ) {
          setSelectedMcqIds(
            Array.isArray(contestData.MCQ) 
              ? contestData.MCQ 
              : JSON.parse(contestData.MCQ)
          );
        }
      } catch (err) {
        setError('Failed to load contest');
        console.error(err);
      }
    };

    if (id) {
      fetchContest();
    }
  }, [id]);

  // Fetch questions data
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch DSA questions
        const dsaResponse = await axios.get(`${config.HOST}/question/`);
        setDsaQuestions(dsaResponse.data);
        
        // Fetch MCQ questions
        const mcqResponse = await axios.get(`${config.HOST}/question/mcqs`);
        setMcqQuestions(mcqResponse.data);
      } catch (err) {
        setError('Failed to load questions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Toggle DSA question selection
  const toggleDsaQuestion = (id: number) => {
    setSelectedDsaIds(prev => 
      prev.includes(id) 
        ? prev.filter(qId => qId !== id) 
        : [...prev, id]
    );
  };

  // Toggle MCQ question selection
  const toggleMcqQuestion = (id: number) => {
    setSelectedMcqIds(prev => 
      prev.includes(id) 
        ? prev.filter(qId => qId !== id) 
        : [...prev, id]
    );
  };

  // Save contest questions
  const saveContestQuestions = async () => {
    if (!contest) return;
    console.log('Saving contest questions...');
    try {
      setIsSaving(true);
      setSaveMessage(null);
      
      await axios.put(`${config.HOST}/contests/${id}`, {
        ...contest,
        questions: JSON.stringify(selectedDsaIds),
        MCQ: JSON.stringify(selectedMcqIds)
      });
      
      setSaveMessage('Questions saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to save questions');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="mt-2">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Edit Questions for {contest?.name || 'Contest'}
          </h1>
          <p className="text-gray-600">
            Select questions to include in this contest
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dsa'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('dsa')}
            >
              DSA Questions ({selectedDsaIds.length} selected)
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mcq'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('mcq')}
            >
              MCQ Questions ({selectedMcqIds.length} selected)
            </button>
          </nav>
        </div>

        {/* Question lists */}
        <div className="mb-6">
          {activeTab === 'dsa' ? (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold mb-4">DSA Questions</h2>
              {dsaQuestions.length === 0 ? (
                <p className="text-gray-500">No DSA questions available</p>
              ) : (
                dsaQuestions.map(question => (
                  <div 
                    key={question.id}
                    className={`p-4 border rounded cursor-pointer ${
                      selectedDsaIds.includes(question.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleDsaQuestion(question.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDsaIds.includes(question.id)}
                        onChange={() => {}}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <span className="font-medium">ID: {question.id}</span> - {question.title}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold mb-4">MCQ Questions</h2>
              {mcqQuestions.length === 0 ? (
                <p className="text-gray-500">No MCQ questions available</p>
              ) : (
                mcqQuestions.map(question => (
                  <div 
                    key={question.id}
                    className={`p-4 border rounded cursor-pointer ${
                      selectedMcqIds.includes(question.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleMcqQuestion(question.id)}
                  >
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={selectedMcqIds.includes(question.id)}
                        onChange={() => {}}
                        className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium mb-1">ID: {question.id}</div>
                        <div className="text-gray-700 mb-2">{question.description}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className={`p-2 rounded ${question.answer === 1 ? 'bg-green-100' : 'bg-gray-100'}`}>
                            1. {question.option1}
                          </div>
                          <div className={`p-2 rounded ${question.answer === 2 ? 'bg-green-100' : 'bg-gray-100'}`}>
                            2. {question.option2}
                          </div>
                          <div className={`p-2 rounded ${question.answer === 3 ? 'bg-green-100' : 'bg-gray-100'}`}>
                            3. {question.option3}
                          </div>
                          <div className={`p-2 rounded ${question.answer === 4 ? 'bg-green-100' : 'bg-gray-100'}`}>
                            4. {question.option4}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Save actions */}
        <div className="flex justify-between items-center mt-6">
          <div>
            {saveMessage && (
              <span className="text-green-600 font-medium">{saveMessage}</span>
            )}
          </div>
          <div className="flex space-x-4">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={() => saveContestQuestions()}
            >
              {isSaving ? 'Saving...' : 'Save Questions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestQuestionsEditor;