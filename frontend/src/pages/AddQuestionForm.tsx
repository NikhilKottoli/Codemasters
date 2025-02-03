import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface QuestionFormData {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  timeLimit: string;
  acceptance: string;
  exampleInput: string;
  expectedOutput: string;
  constraint_data: string;
}

const AddQuestionForm = () => {
  const [formData, setFormData] = useState<QuestionFormData>({
    title: "",
    description: "",
    difficulty: 'Easy',
    category: "",
    timeLimit: "",
    acceptance: "",
    exampleInput: "",
    expectedOutput: "",
    constraint_data: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: keyof QuestionFormData) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:3000/question/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          title: "",
          description: "",
          difficulty: 'Easy',
          category: "",
          timeLimit: "",
          acceptance: "",
          exampleInput: "",
          expectedOutput: "",
          constraint_data: "",
        });
      } else {
        throw new Error("Failed to submit question");
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black flex justify-center items-center p-6">
      <Card className="max-w-2xl w-full bg-gray-100 text-gray-900 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Add New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => handleInputChange(e, "title")} placeholder="Enter question title" />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => handleInputChange(e, "description")} placeholder="Enter question description" />
            </div>

            <div>
              <Label>Difficulty</Label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange(e, "difficulty")}
                className="w-full p-2 border rounded"
              >
                <option value='Easy'>Easy</option>
                <option value='Medium'>Medium</option>
                <option value='Hard'>Hard</option>
              </select>
            </div>

            <div>
              <Label>Category</Label>
              <Input value={formData.category} onChange={(e) => handleInputChange(e, "category")} placeholder="Enter question category" />
            </div>

            <div>
              <Label>Time Limit</Label>
              <Input value={formData.timeLimit} onChange={(e) => handleInputChange(e, "timeLimit")} placeholder="Enter time limit" />
            </div>

            <div>
              <Label>Acceptance Rate</Label>
              <Input value={formData.acceptance} onChange={(e) => handleInputChange(e, "acceptance")} placeholder="Enter acceptance rate" />
            </div>

            <div>
              <Label>Example Input</Label>
              <Textarea value={formData.exampleInput} onChange={(e) => handleInputChange(e, "exampleInput")} placeholder="Enter example input" />
            </div>

            <div>
              <Label>Expected Output</Label>
              <Textarea value={formData.expectedOutput} onChange={(e) => handleInputChange(e, "expectedOutput")} placeholder="Enter expected output" />
            </div>

            <div>
              <Label>Constraint</Label>
              <Textarea value={formData.constraint_data} onChange={(e) => handleInputChange(e, "constraint_data")} placeholder="Enter constraint_data" />
            </div>

            <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600" disabled={loading}>
              {loading ? "Adding..." : "Submit Question"}
            </Button>

            {success && <p className="mt-4 text-green-500">Question Added Successfully!</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddQuestionForm;