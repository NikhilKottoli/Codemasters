const { client } = require('../redisClient');
const {supabase,supabase1} = require("../supabase");

const executeTask = async (req, res) => {
  // console.log('Received submission:', req.body);

  const { language, userId, code, action, stdin } = req.body;
  try {
   
    if (!language || !userId || !code || !action ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if(!stdin){
      return res.status(400).json({error:"missing inputs"})
    }

  if(req.body.action === 'run') {
    const { language, userId, code, action,stdin,output } = req.body;

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

  
    const { language, userId, code, action } = req.body;

    // Validate required field
   

    // Determine the queue based on the action
    let queue = 'submitQueue';

    // If it's a submitQueue, store the submission in Supabase
    
      const { data, error } = await supabase
        .from('submission')
        .insert([
          {
            user_id: userId,
            code: code,
            language: language,
          },
        ]);

      if (error) {
        console.error('Error inserting into Supabase:', error);
        return res.status(500).json({ error: 'Failed to insert submission into Supabase' });
      }
    

    // Add task to the appropriate Redis queue
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
    console.log("computed result");
    console.log(result);
    const parsedResult = JSON.parse(result);
    console.log(`Result for task ${id}:`, parsedResult);
    res.status(200).json(parsedResult);
  } catch (error) {
    console.error('Error fetching task result:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { executeTask, getTaskResultById };
