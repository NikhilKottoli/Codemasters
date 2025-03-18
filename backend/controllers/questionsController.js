const { format } = require('path');
const {supabase, supabase1} = require('../supabase'); // Import the Supabase client

// Get all questions title and some details
const getAllQuestions = async (req, res) => {
  try {
    // Fetching questions from Supabase
    const { data, error } = await supabase
      .from('questions')  // Table name
      .select('id, title, difficulty, category'); // Fetch only necessary columns

    if (error) {
      throw error;  // Throw error if there is any issue with the query
    }

    res.json(data); // Respond with the data
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
};

// Get full question by ID
const getQuestionById = async (req, res) => {
  const questionId = req.params.id; // Extract the question ID from the request parameters

  try {
    // Fetching a specific question by ID
    // console.log(questionId);
    const { data, error } = await supabase
      .from('questions') // Table name
      .select('*') // Fetch all columns
      .eq('id', questionId) // Filter by the provided ID
      .single(); // Since we're expecting one result

    if (error) {
      throw error; // If there's an error, throw it
    }

    if (!data) {
      return res.status(404).json({ message: 'Question not found' }); // Handle case where question is not found
    }


    // console.log("Raw data from DB:", data);
    const example_input=data.example_input;
    const expected_output=data.expected_output;

    const filteredExampleInput = Object.fromEntries(
      Object.entries(example_input).slice(0,data.visible_test_cases)
    );

    const filteredExpectedOutput = Object.fromEntries(
      Object.entries(expected_output).slice(0,data.visible_test_cases)
    );

    const formattedData = {
      ...data,
      example_input: filteredExampleInput,
      expected_output: filteredExpectedOutput
    };

    res.json(formattedData); // Respond with the full question data
  } catch (error) {
    console.error('Error fetching question:', error.message);
    res.status(500).json({ message: 'Failed to fetch question', error: error.message });
  }
};




const addQuestion = async (req, res) => {
  // console.log("addQuestion hit");
  // console.log(req.body);

  // Extract and validate data from request body
  const {
    title,
    description,
    difficulty,
    category,
    timeLimit,
    acceptance,
    exampleInput,
    expectedOutput,
    constraint_data,
    visible_test_cases
  } = req.body;

  if (!title || !description || !difficulty || !category || !exampleInput || !expectedOutput) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Insert data into the questions table
    const { data, error } = await supabase
      .from("questions")
      .insert([
        {
          title,
          description,
          difficulty,
          category,
          time_limit: timeLimit,  // Corrected field name
          acceptance,
          example_input: exampleInput,  // Corrected field name
          expected_output: expectedOutput,  // Corrected field name
          constraint_data,
          visible_test_cases // Ensure this column exists in DB
        },
      ]);

    if (error) {
      throw error;
    }

    return res.status(201).json({ message: "Question added successfully", data });
  } catch (err) {
    console.error("Error adding question:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = { addQuestion ,getAllQuestions,getQuestionById };
