const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => console.log("Redis error:", err));
client.on("connect", () => console.log("Redis connected"));

(async () => {
  await client.connect();
})();

// Get cached data
const getCache = async (key) => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

// Set cache with TTL in seconds (default 5 minutes)
const setCache = async (key, data, ttl = 300) => {
  await client.setEx(key, ttl, JSON.stringify(data));
};

// Delete a cache key (call when data changes)
const deleteCache = async (key) => {
  await client.del(key);
};

module.exports = { getCache, setCache, deleteCache };