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
        content: task.source
      }],
      stdin: task.stdin || ''
    });

    return response.data;
  }

  async storeResult(taskId, result) {
    await this.redis.setex(`run:${taskId}`, 3600, JSON.stringify(result));
    await this.redis.lpush('processed_results', taskId);
  }

  async processTask(taskData) {
    let task;
    try {
      task = JSON.parse(taskData);
      if (!task.language || !task.source || !task.id) {
        throw new Error('Invalid task format - missing required fields');
      }

      console.log(`Processing task ${task.id}...`);
      const result = await this.executeCode(task);
      
      await this.storeResult(task.id, {
        taskId: task.id,
        status: 'completed',
        result: result,
        completedAt: new Date().toISOString()
      });

      console.log(`Task ${task.id} processed successfully`);
      return result;
    } catch (error) {
      console.error(`Task processing failed: ${error.message}`);
      
      if (task?.id) {
        await this.storeResult(task.id, {
          taskId: task.id,
          status: 'failed',
          error: error.message,
          completedAt: new Date().toISOString()
        });
      }
    }
  }

  async processNextSubmission() {
    const submission = await this.redis.rpop('submissions');
    if (submission) {
      console.log('Processing submission from submissions queue');
      await this.processTask(submission);
      // Add delay for rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async start() {
    while (this.isRunning) {
      try {
        console.log('Waiting for tasks...');
        const result = await this.redis.brpop('taskQueue', 1);
        
        if (result) {
          // Process taskQueue item with priority
          const [queue, taskData] = result;
          console.log('Task received from queue:', queue);
          await this.processTask(taskData);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          await this.processNextSubmission();
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