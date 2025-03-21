const Redis = require('ioredis');
const axios = require('axios');

class TaskProcessor {
  constructor(redisUrl = 'redis://localhost:6379') {
    this.redis = new Redis(redisUrl);
    this.isRunning = true;
    this.queues = {
      run: 'runQueue',
      submit: 'submitQueue'
    };
    this.resultQueues = {
      run: 'runResults',
      submit: 'submitResults'
    };
    this.setupShutdown();
  }

  async executeCode(task) {
    const fileExtension = {
      python: 'py',
      javascript: 'js',
      java: 'java'
    }[task.language] || 'txt';

    
    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: task.language,
      version: task.version || '*',
      files: [{
        name: `main.${fileExtension}`,
        content: task.code
      }],
      stdin: task.stdin || ''
    });
    response.data.run.status = "completed";
    return response.data;
    } catch (error) {
      console.error('Execution error:', error.message);
      return { error: error.message};
    }
  }

  async storeResult(taskId, result, queueType, expectedOutput) {
    // Validate queue type
    if (!this.resultQueues[queueType]) {
      throw new Error(`Queue type "${queueType}" is not valid!`);
    }

    try {
      if (queueType === 'submit') {
        let temp = (result.run?.output || "").replace(/\r?\n|\r/g, "\n").trim();
        let updatedResult = {
          ...result,
          run: {
            ...result.run,
            output: temp === expectedOutput ? "Accepted" : "Wrong Answer",
            status:"completed"
          }
        };

        // Store result in Redis and manage queues
        const resultQueue = this.resultQueues[queueType];
        const resultJson = JSON.stringify(updatedResult);
        
        await this.redis.setex(`result:${taskId}`, 300, resultJson);
        await this.redis.lpush(resultQueue, resultJson);
        await this.redis.expire(resultQueue, 600); // Expire after 10 mins
        
        return updatedResult;
      }
      
      // Prepare result data
      let resultData = {
        taskId,
        status: result.run ? 'completed' : 'error',
        output: result.run ? result.run.output : result.error,
        completedAt: new Date().toISOString()
      };

      // Store result in Redis and manage queues
      const resultQueue = this.resultQueues[queueType];
      const resultJson = JSON.stringify(resultData);
      
      await this.redis.setex(`result:${taskId}`, 300, resultJson);
      await this.redis.lpush(resultQueue, resultJson);
      await this.redis.expire(resultQueue, 600); // Expire after 10 mins
      
      return resultData;
    } catch (error) {
      console.error(`Error storing result for task ${taskId}:`, error);
      throw error; 
    }
  }

  async processTask(taskData, queueType) {
    let task;
    try {
      task = JSON.parse(taskData);
      if (!task.taskId || !task.language || !task.code) {
        throw new Error('Invalid task format');
      }
      
      console.log(`Processing ${queueType} task ${task.taskId}...`);
      let result = await this.executeCode(task);
      result = await this.storeResult(task.taskId, result, queueType,task.expectedOutput);
      console.log(`${queueType} task ${task.taskId} processed successfully`);
      return result;
    } catch (error) {
      console.error(`Task processing failed: ${error.message}`);
      
      if (task?.taskId) {
        await this.storeResult(task.taskId, { error: error.message }, queueType);
      }
    }
  }

  async checkQueue() {
    // First check run queue
    let result = await this.redis.brpop(this.queues.run, 1);
    
    if (!result) {
      // If no run tasks, check submit queue
      result = await this.redis.brpop(this.queues.submit, 1);
      if (result) {
        return { data: result[1], type: 'submit' };
      }
    } else {
      return { data: result[1], type: 'run' };
    }
    
    return null;
  }

  async start() {
    while (this.isRunning) {
      try {
        const queueResult = await this.checkQueue();
        
        if (queueResult) {
          await this.processTask(queueResult.data, queueResult.type);
          // Add small delay between processing tasks
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