const Redis = require('ioredis');
const axios = require('axios');

class TaskProcessor {
  constructor(redisUrl = 'redis://localhost:6379') {
    this.redis = new Redis(redisUrl);
    this.isRunning = true;
    this.setupShutdown();
  }

  async executeCode(task) {
    const fileExtension = {
      python: 'py',
      javascript: 'js',
      java: 'java'
    }[task.language] || 'txt';

    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: task.language,
      version: task.version || '*',
      files: [{
        name: `main.${fileExtension}`,
        content: task.code
      }],
      stdin: task.stdin || ''
    });

    return response.data;
  }

  async storeResult(taskId, result, queue = 'runResults') {
    const resultData = {
      taskId,
      status: result.run ? 'completed' : 'error',
      output: result.run ? result.run.output : result.error,
      completedAt: new Date().toISOString()
    };

    // Store result in Redis with expiration
    await this.redis.setex(`result:${taskId}`, 3600, JSON.stringify(resultData));
    
    // Push to results queue
    await this.redis.lpush(queue, JSON.stringify(resultData));
  }

  async processTask(taskData) {
    let task;
    try {
      task = JSON.parse(taskData);
      if (!task.taskId || !task.language || !task.code) {
        throw new Error('Invalid task format');
      }

      console.log(`Processing task ${task.taskId}...`);
      const result = await this.executeCode(task);
      
      await this.storeResult(task.taskId, result);
      console.log(`Task ${task.taskId} processed successfully`);
      return result;
    } catch (error) {
      console.error(`Task processing failed: ${error.message}`);
      
      if (task?.taskId) {
        await this.storeResult(task.taskId, { error: error.message });
      }
    }
  }

  async start() {
    while (this.isRunning) {
      try {
        const result = await this.redis.brpop('taskQueue', 1);
        
        if (result) {
          const [, taskData] = result;
          await this.processTask(taskData);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Processing error:', error.message);
      }
    }
  }

  setupShutdown() {
    process.on('SIGINT', async () => {
      console.log('Shutting down gracefully...');
      this.isRunning = false;
      await this.redis.quit();
      process.exit(0);
    });
  }
}

const processor = new TaskProcessor();
processor.start().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});