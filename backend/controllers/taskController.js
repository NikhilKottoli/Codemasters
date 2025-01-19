const { client } = require('../redisClient');  // Import Redis client

// POST /test - Add a new task to Redis
const addTask = async (req, res) => {
  try {
    const data = req.body;

    if (!data.language || !data.source) {
      return res.status(400).json({ error: 'Missing required fields: language or source' });
    }

    // Also push task to taskQueue for processing
    await client.lPush('taskQueue', JSON.stringify(data));
    await client.lPush('submissions', JSON.stringify(data));

    res.status(200).json({ message: 'Task added successfully' });
  } catch (err) {
    console.error('Error adding task:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const runTask = async (req, res) => {
  try {
    const data = req.body;

    if (!data.language || !data.source) {
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
  const { id } = req.params;  // Get task ID from request parameters

  try {
    // Check if a result exists for the given task ID
    const result = await client.get(`result:${id}`);

    if (!result) {
      return res.status(404).json({ message: `No result found for task with ID: ${id}` });
    }

    // Parse the result and return it
    const parsedResult = JSON.parse(result);
    console.log(`Result for task ${id}:`, parsedResult);
    res.status(200).json(parsedResult);
  } catch (error) {
    console.error('Error fetching task result:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { addTask, getTaskResultById };
