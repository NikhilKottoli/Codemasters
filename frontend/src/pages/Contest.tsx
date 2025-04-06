import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import config from '@/config';
// Define Contest type based on your actual data structure
interface Contest {
  id: number;
  name: string;
  desc: string;
  public: boolean;
  start_time: string;
  end_time: string;
}

const ContestDetailsPage: React.FC = () => {
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // New state for registration status
  const { id } = useParams<{ id: string }>();
  const navigate=useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);

        // Retrieve the user ID from localStorage
        const userId = localStorage.getItem('token');
        if (!userId) {
          throw new Error('User ID not found in localStorage');
        }

        const response = await axios.get(`http://${config.HOST}/contests/${id}`);
        setContest(response.data[0]); // API returns an array with one contest

        // Check if the user is already registered
        const registrationResponse = await axios.get(`http://${config.HOST}/contests/${id}/is-registered`, {
          params: { user_id: userId },
        });
        setIsRegistered(registrationResponse.data.isRegistered);
      } catch (err) {
        setError('Failed to load contest details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContest();
    }
  }, [id]);

  const handleRegister = async () => {
    try {
      // Retrieve the user ID from localStorage
      const userId = localStorage.getItem('token');
      if (!userId) {
        alert('User ID not found. Please log in again.');
        return;
      }

      const response = await axios.post(`http://${config.HOST}/contests/${contest?.id}`, {
        user_id: userId,
      });
      if (response.status === 200) {
        alert('Successfully registered for the contest!');
        setIsRegistered(true); // Update state after successful registration
      } else {
        alert('Failed to register for the contest.');
      }
    } catch (error) {
      console.error('Error registering for the contest:', error);
      alert('An error occurred while registering.');
    }
  };

  // Format date and time for display
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  // Calculate if contest is active, upcoming, or ended
  const getContestStatus = () => {
    if (!contest) return '';
    
    const now = new Date();
    const startTime = new Date(contest.start_time);
    const endTime = new Date(contest.end_time);
    
    if (now < startTime) return 'upcoming';
    if (now > endTime) return 'ended';
    return 'active';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="mt-2">{error || 'Contest not found'}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate('/contests')}
        >
          Go Back
        </button>
      </div>
    );
  }

  const contestStatus = getContestStatus();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{contest.name}</h1>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium 
              ${contestStatus === 'active' ? 'bg-green-100 text-green-800' : 
                contestStatus === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {contestStatus}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium 
              ${contest.public ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
              {contest.public ? 'Public' : 'Private'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium 
              ${isRegistered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isRegistered ? 'Registered' : 'Not Registered'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{contest.desc}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Contest Information</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">Contest ID:</span>
                <span className="ml-2">{contest.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Start Time:</span>
                <span className="ml-2">{formatDateTime(contest.start_time)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">End Time:</span>
                <span className="ml-2">{formatDateTime(contest.end_time)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Visibility:</span>
                <span className="ml-2">{contest.public ? 'Public' : 'Private'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2 hover:bg-gray-300"
            onClick={() => navigate('/contests')}
          >
            Back
          </button>
          {contestStatus === 'upcoming' && !isRegistered && (
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleRegister}
            >
              Register
            </button>
          )}
          {contestStatus === 'active' && (
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={()=>navigate(`/contestPage/${contest.id}`)}
            >
              Enter Contest
            </button>
          )}
          <button 
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mx-3"
            onClick={() =>navigate(`/contest/editor/${contest.id}`)}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailsPage;