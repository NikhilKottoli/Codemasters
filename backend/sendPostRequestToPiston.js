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
    await this.redis.setex(`result:${taskId}`, 3600, JSON.stringify(result));
    
    await this.redis.lpush('processed_results', taskId);
  }

  async processTask(taskData) {
    try {
      const task = JSON.parse(taskData);
      if (!task.language || !task.source || !task.id) {
        throw new Error('Invalid task format - missing required fields');
      }

      console.log(`Processing task ${task.id}...`);
      const result = await this.executeCode(task);
      
      // Store execution result in Redis
      await this.storeResult(task.id, {
        taskId: task.id,
        status: 'completed',
        result: result,
        completedAt: new Date().toISOString()
      });

      console.log(`Task ${task.id} processed successfully`);
      await this.redis.lrem('submissions', 0, taskData);
      return result;
    } catch (error) {
      console.error(`Task processing failed: ${error.message}`);
      
      // Store error result
      if (task?.id) {
        await this.storeResult(task.id, {
          taskId: task.id,
          status: 'failed',
          error: error.message,
          completedAt: new Date().toISOString()
        });
      }
      
      await this.redis.lrem('submissions', 0, taskData);
    }
  }

  async start() {
    while (this.isRunning) {
      try {
        console.log('Waiting for tasks...');
        const result = await this.redis.brpop('taskQueue', 0);
        
        if (result) {
          const [queue, taskData] = result;
          console.log('Task received from queue:', queue);
          
          const tasks = await this.redis.lrange('submissions', 0, -1);
          console.log(`Processing ${tasks.length} submissions...`);
          
          for (const task of tasks) {
            if (!this.isRunning) break;
            await this.processTask(task);
          }
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