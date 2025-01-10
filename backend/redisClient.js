const { createClient } = require('redis');
require('dotenv').config();

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

module.exports = { client };
