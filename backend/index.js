require('dotenv').config();
const express = require('express');
const { createClient } = require('redis');

const app = express();
const port = process.env.PORT || 3000;

const redis_url = process.env.REDIS_URL || 'redis://localhost:6379';
const client = createClient({ url: redis_url });

(async () => {
  try {
    await client.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err.message);
    process.exit(1); // Exit if Redis connection fails
  }
})();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/test', async (req, res) => {
  try {
    const data = req.body;
    await client.lPush('submissions', JSON.stringify(data));
    res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await client.lRange('submissions', 0, -1);
    const parsedTasks = tasks.map(task => JSON.parse(task));
    console.log('Tasks:', parsedTasks);
    res.status(200).json(parsedTasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
