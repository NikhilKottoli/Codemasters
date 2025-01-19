import React, { useState } from 'react';
import { Code2, Play, Send, Book, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import Editor from '@monaco-editor/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const defaultCode = `function solve() {
  // Your solution here
}`;

const sampleProblem = {
  title: "Two Sum",
  difficulty: "Easy",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ]
};

const editorial = `## Solution Approach

1. Use a hash map to store the complement of each number
2. For each number, check if its complement exists in the hash map
3. Time complexity: O(n)
4. Space complexity: O(n)

\`\`\`javascript
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}
\`\`\``;

export default function CodeEditor() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCode);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditorial, setShowEditorial] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Code executed successfully!');
    } catch (error) {
      toast.error('Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Solution submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Code2 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">CodeMaster</h1>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Problem Statement Card */}
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{sampleProblem.title}</CardTitle>
                <CardDescription>
                  Difficulty: {sampleProblem.difficulty}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditorial(!showEditorial)}
              >
                <Book className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="editorial" disabled={!showEditorial}>
                  Editorial
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="space-y-4">
                <p>{sampleProblem.description}</p>
                <div className="space-y-2">
                  <h3 className="font-semibold">Example 1:</h3>
                  <div className="space-y-1">
                    <p>Input: {sampleProblem.examples[0].input}</p>
                    <p>Output: {sampleProblem.examples[0].output}</p>
                    <p>Explanation: {sampleProblem.examples[0].explanation}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="editorial">
                <div className="prose prose-sm max-w-none">
                  {editorial}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Code Editor Card */}
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader className="space-y-0 pb-4">
            <div className="flex items-center space-x-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex-1" />

              <Button
                onClick={handleRun}
                disabled={isRunning}
                variant="secondary"
              >
                {isRunning ? (
                  <>Running...</>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run
                  </>
                )}
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="default"
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Editor
              height="70vh"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}