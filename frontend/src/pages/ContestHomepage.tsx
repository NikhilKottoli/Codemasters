import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "@/config";

// Define the types for a contest
interface Contest {
  id: number;
  name: string;
  desc: string;
  public: boolean;
  start_time: string;
  end_time: string;
}

// Define the types for the form data
interface FormData {
  name: string;
  desc: string;
  public: boolean;
  start_time: string;
  end_time: string;
}

const Contests: React.FC = () => {

  //to navigate on click
  const navigate = useNavigate();
  const [contests, setContests] = useState<Contest[]>([]); // State for contests
  const [formData, setFormData] = useState<FormData>({
    name: "",
    desc: "",
    public: false,
    start_time: "",
    end_time: "",
  });
  const [error, setError] = useState<string>(""); // State for error messages
  const [success, setSuccess] = useState<string>(""); // State for success messages

  // Fetch all contests
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get<Contest[]>(`http://${config.HOST}/contests`);
        setContests(response.data);
      } catch (err) {
        console.error("Error fetching contests:", err);
      }
    };

    fetchContests();
  }, []);

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`http://${config.HOST}/contests`, formData);
      setSuccess("Contest added successfully!");
      setContests( response.data); // Add the new contest to the list
      setFormData({
        name: "",
        desc: "",
        public: false,
        start_time: "",
        end_time: "",
      });
    } catch (err: any) {
      console.error("Error adding contest:", err.message);
      setError("Failed to add contest. Please try again.");
    }
  };

  // Filter contests into ongoing and upcoming
  const now = new Date();
  const ongoingContests = contests.filter(
    (contest) => new Date(contest.start_time) <= now && new Date(contest.end_time) >= now
  );
  const upcomingContests = contests.filter(
    (contest) => new Date(contest.start_time) > now
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contests</h1>

      {/* Display success or error messages */}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Ongoing Contests Table */}
      <h2 className="text-2xl font-bold mb-4">Ongoing Contests</h2>
      <div className="overflow-x-auto mb-6">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Public</th>
              <th className="border border-gray-300 px-4 py-2">Start Time</th>
              <th className="border border-gray-300 px-4 py-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {ongoingContests.map((contest) => (
              
              <tr key={contest.id} className="hover:bg-gray-50" onClick={() => navigate(`/contests/${contest.id}`)}>
                <td className="border border-gray-300 px-4 py-2">{contest.id}</td>
                <td className="border border-gray-300 px-4 py-2">{contest.name}</td>
                <td className="border border-gray-300 px-4 py-2">{contest.desc}</td>
                <td className="border border-gray-300 px-4 py-2">{contest.public ? "Yes" : "No"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(contest.start_time).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(contest.end_time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Contests Table */}
      <h2 className="text-2xl font-bold mb-4">Upcoming Contests</h2>
      <div className="overflow-x-auto mb-6">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Public</th>
              <th className="border border-gray-300 px-4 py-2">Start Time</th>
              <th className="border border-gray-300 px-4 py-2">End Time</th>
            </tr>
          </thead>
          <tbody>
          
            {upcomingContests.map((contest) => (
              <tr key={contest.id} className="hover:bg-gray-50" onClick={() => navigate(`/contests/${contest.id}`)}>
                <td className="border border-gray-300 px-4 py-2">{contest.id}</td>
                <td className="border border-gray-300 px-4 py-2">{contest.name}</td>
                <td className="border border-gray-300 px-4 py-2">{contest.desc}</td>
                <td className="border border-gray-300 px-4 py-2">{contest.public ? "Yes" : "No"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(contest.start_time).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(contest.end_time).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Contest Form */}
      <h2 className="text-2xl font-bold mb-4">Add Contest</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description:</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Public:</label>
          <input
            type="checkbox"
            name="public"
            checked={formData.public}
            onChange={handleChange}
            className="mr-2"
          />
          <span>Is this contest public?</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Time:</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Time:</label>
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Contest
        </button>
      </form>
    </div>
  );
};

export default Contests;