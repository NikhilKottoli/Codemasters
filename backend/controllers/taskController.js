const { client } = require('../redisClient');
const {supabase} = require("../supabase");

const executeTask = async (req, res) => {
  // console.log('Received submission:', req.body);

  const { language,taskId, userId, code, action, stdin, questionId, output, contestId } = req.body;
  try {
   
    if (!language || !userId || !code || !action ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if(!stdin){
      return res.status(400).json({error:"missing inputs"})
    }

  if(req.body.action === 'run') {
    
    // Validate required field
    if(!stdin||!output){ 
      return res.status(400).json({ error: 'Missing required fields' });
    }
    let queue ='runQueue';

    await Promise.all([
      client.lPush(queue, JSON.stringify(req.body)),
    ]);

    res.status(200).json({ 
      message: 'Submission added successfully', 
    });
  } else {
    let queue = 'submitQueue';

    const { data: data1, error: error1 } = await supabase
      .from('questions')
      .select('example_input, expected_output')
      .eq('id', questionId)
      .single();

    const totalTestCases = Object.keys(data1?.example_input || {}).length;
    req.body.stdin = totalTestCases + "\n" +Object.values(data1?.example_input || {}).join("\n");
    req.body.expectedOutput = Object.values(data1?.expected_output || {}).join("\n");

    // If this is a contest submission, create an entry in contest_submissions table
    if (contestId) {
      const { error } = await supabase
        .from('contest_submissions')
        .insert([
          {
            id:taskId,
            contest_id: contestId,
            user_id: userId,
            question_id: questionId,
            code: code,
            language: language,
            verdict: 'PENDING'
          }
        ]);
      if (error) {
        console.error('Error creating contest submission:', error);
        return res.status(500).json({ error: 'Failed to create contest submission' });
      }
    }

    await Promise.all([
      client.lPush(queue, JSON.stringify(req.body)),
    ]);

    res.status(200).json({ 
      message: 'Submission added successfully', 
    });
  }
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).json({ error: 'Failed to add task' });
  }
};

// GET /tasks/:id - Get task result by ID from Redis
const getTaskResultById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.get(`result:${id}`);

    if (!result) {
      return res.status(404).json({ message: `No result found for task with ID: ${id}` });
    }

    const parsedResult = JSON.parse(result);

    res.status(200).json(parsedResult);
  } catch (error) {
    console.error('Error fetching task result:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getSubmitbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.get(`result:${id}`);

    if (!result) {
      return res.status(404).json({ message: `No result found for task with ID: ${id}` });
    }

    const parsedResult = JSON.parse(result);
    
    // If this is a contest submission, update the verdict in contest_submissions table
    if (parsedResult.contestId) {
      console.log(parsedResult);
      const verdict = parsedResult.run.output === 'Accepted' ? 'AC' : 'WA';
      const { error } = await supabase
        .from('contest_submissions')
        .update({ verdict })
        .match({ 
          id: id,
        });

      if (error) {
        console.error('Error updating contest submission verdict:', error);
      }
    }
    

    const formattedResponse = {
      taskId: id,
      language: parsedResult.language,
      version: parsedResult.version,
      status: parsedResult.run?.status || "unknown",
      stdout: parsedResult.run?.stdout || "",
      stderr: parsedResult.run?.stderr || "",
      compile_output: parsedResult.compile?.stderr || "",
      result: parsedResult.run?.output || "Unknown"
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error('Error fetching task result:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { executeTask, getTaskResultById, getSubmitbyId };
