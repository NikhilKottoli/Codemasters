import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Question {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
}

const getDifficultyColor = (difficulty: Question["difficulty"]) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-500";
    case "Medium":
      return "bg-yellow-500";
    case "Hard":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const QuestionsList = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:3000/question/")
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError("Failed to fetch questions");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-8">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Practice Problems</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {questions.map((question) => (
            <Link to={`/solve/${question.id}`} key={question.id}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{question.title}</CardTitle>
                    <Badge className={`${getDifficultyColor(question.difficulty)} text-white`}>
                      {question.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Category: {question.category}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsList;
