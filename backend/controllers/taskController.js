const { client } = require('../redisClient');  // Import Redis client

// POST /test - Add a new task to Redis
const Submit = async (req, res) => {
  console.log('Received submission:', req.body);
  try {
    const { language } = req.body;

    // Validate required field
    if (!language) {
      return res.status(400).json({ error: 'Missing required field: language' });
    }

    // Push task to Redis queues
    await Promise.all([
      client.lPush('submissions', JSON.stringify(task))
    ]);

    res.status(200).json({ 
      message: 'Submission added successfully', 
      taskId: task.id 
    });
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).json({ error: 'Failed to add task' });
  }
};

const runTask = async (req, res) => {
  try {
    const data = req.body;
    console.log('Received task:', data);
    if (!data.language ||!data.code || !data.taskId) {
      return res.status(400).json({ error: 'Missing required fields: language or source' });
    }

    // Also push task to taskQueue for processing
    await client.lPush('taskQueue', JSON.stringify(data));

    res.status(200).json({ message: 'Task added successfully' });
  } catch (err) {
    console.error('Error adding task:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// GET /tasks/:id - Get task result by ID from Redis
const getTaskResultById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.get(`result:${id}`);

    if (!result) {
      return res.status(404).json({ message: `No result found for task with ID: ${id}` });
    }
    const parsedResult = JSON.parse(result);
    console.log(`Result for task ${id}:`, parsedResult);
    res.status(200).json(parsedResult);
  } catch (error) {
    console.error('Error fetching task result:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { Submit, getTaskResultById, runTask };
