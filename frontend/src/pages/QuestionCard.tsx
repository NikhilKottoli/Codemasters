import React from 'react';

const QuestionCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full overflow-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Problem Statement</h2>
      <div className="prose prose-sm">
        <p className="text-gray-600">
          Write a function that takes an array of integers and returns the two numbers that add up to a specific target.
        </p>
        <h3 className="text-lg font-semibold mt-4">Example:</h3>
        <pre className="bg-gray-100 p-2 rounded">
          Input: nums = [2,7,11,15], target = 9
          Output: [0,1]
        </pre>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Constraints:</h3>
          <ul className="list-disc pl-4">
            <li>2 ≤ nums.length ≤ 10⁴</li>
            <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;