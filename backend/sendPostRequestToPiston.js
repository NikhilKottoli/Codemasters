const axios = require('axios');
const { createClient } = require('redis');
const logger = require('./logger');

const client = createClient({ url: 'redis://localhost:6379' });
client.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Error connecting to Redis:', err.message);
});

const MAX_RETRIES = 5;

const validateTask = (task) => {
  const requiredFields = ['language', 'source'];
  for (const field of requiredFields) {
    if (!task[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
};

const sendPostRequestToPiston = async (task, taskIndex, attempt = 1) => {
  try {
    validateTask(task);

    // Transform the task into the correct Piston API format
    const pistonPayload = {
      language: task.language,
      version: task.version || '*',
      files: [{
        name: `main.${getFileExtension(task.language)}`,
        content: task.source
      }],
      stdin: task.stdin || ''
    };

    const response = await axios.post('https://emkc.org/api/v2/piston/execute', pistonPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response from Piston:', response.data);
    
    if (response.status === 200) {
      await client.lRem('submissions', 0, JSON.stringify(task));
      console.log(`Task at index ${taskIndex} removed from Redis.`);
    }

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && attempt <= MAX_RETRIES) {
      const backoffTime = Math.pow(2, attempt) * 1000;
      console.log(`Rate limit exceeded, retrying in ${backoffTime / 1000} seconds...`);
      await delay(backoffTime);
      return sendPostRequestToPiston(task, taskIndex, attempt + 1);
    } else {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        task: task
      });
      throw error;
    }
  }
};

// Helper function to get appropriate file extension
const getFileExtension = (language) => {
  const extensions = {
    'python': 'py',
    'javascript': 'js',
    'java': 'java',
    'c++': 'cpp',
    'c': 'c',
    'ruby': 'rb',
    'go': 'go',
    'rust': 'rs',
    'php': 'php'
  };
  return extensions[language] || 'txt';
};

const processTasksFromRedis = async () => {
  try {
    const tasks = await client.lRange('submissions', 0, -1);
    console.log(`Processing ${tasks.length} tasks from Redis`);

    for (let i = 0; i < tasks.length; i++) {
      try {
        const taskString = tasks[i];
        const task = JSON.parse(taskString);
        console.log(`Processing task ${i + 1}/${tasks.length}:`, task);
        
        await sendPostRequestToPiston(task, i);
        await delay(1000); // Rate limiting delay
      } catch (parseError) {
        console.error(`Error processing task at index ${i}:`, parseError.message);
        await client.lRem('submissions', 0, tasks[i]);
      }
    }
  } catch (error) {
    console.error('Error processing tasks from Redis:', error.message);
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await client.quit();
  process.exit(0);
});

// Start processing with error handling
const startProcessing = async () => {
  try {
    while (true) {
      await processTasksFromRedis();
      await delay(2000);
    }
  } catch (error) {
    console.error('Fatal error in processing loop:', error);
    await client.quit();
    process.exit(1);
  }
};

startProcessing();