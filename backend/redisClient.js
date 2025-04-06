// redisClient.js
const { createClient } = require('redis');

const client = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 12484,
  },
});

client.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to Redis');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
})();

module.exports = { client }; // ✅ named export
