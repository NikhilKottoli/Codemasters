const { client } = require('../redisClient');  // Import Redis client

// POST /test
const addTask = async (req, res) => {
  try {
    const data = req.body;
    await client.lPush('submissions', JSON.stringify(data));
    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await client.lRange('submissions', 0, -1);
    const parsedTasks = tasks.map(task => JSON.parse(task));
    console.log('Tasks:', parsedTasks);
    res.status(200).json(parsedTasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addTask, getTasks };
