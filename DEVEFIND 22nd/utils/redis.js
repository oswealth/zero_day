import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

/**
 * RedisClient class for interacting with a Redis database.
 * Provides methods to set, get, and delete keys, and check connection status.
 */
class RedisClient {
  /**
   * Creates an instance of RedisClient.
   * Initializes the Redis client and sets up event listeners for connection status.
   */
  constructor () {
    this.client = redis.createClient();

    // Handling connection errors
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.connected = false;
      this.client.quit();
    });

    // Handling successful connection
    this.client.on('connect', () => {
      console.log('Connected to Redis');
      this.connected = true;
    });

    // Handling the end of the connection
    this.client.on('end', () => {
      console.log('Disconnected from Redis');
      this.connected = false;
    });

    // Initialize connection status
    this.connected = false;
  }

  /**
   * Checks if the Redis client is currently connected.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive () {
    return this.connected;
  }

  /**
   * Retrieves the value associated with the specified key from Redis.
   * @param {string} key - The key to retrieve the value for.
   * @returns {Promise<string|null>} A promise that resolves with the value associated with the key,
   * or null if the key does not exist.
   */
  async get (key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        return resolve(reply);
      });
    });
  }

  /**
   * Sets a value for the specified key in Redis.
   * @param {string} key - The key to set.
   * @param {string} value - The value to store.
   * @returns {Promise<string>} A promise that resolves with the result of the set operation,
   * typically 'OK' if successful.
   */
  async set (key, value) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (err, reply) => {
        if (err) {
          return reject(err);
        }
        return resolve(reply);
      });
    });
  }

  /**
   * Sets an expiration time for a given key in the Redis database.
   *
   * This method uses the Redis `EXPIRE` command to set the time-to-live (TTL)
   * for the specified key. The TTL is the duration (in seconds) after which
   * the key will be automatically deleted from the database.
   *
   * @param {string} key - The key for which the expiration time is to be set.
   * @param {number} timeInSec - The expiration time in seconds.
   * @returns {Promise<number>} A promise that resolves to the result of the EXPIRE command.
   *                           The result is typically 1 if the timeout was set successfully,
   *                           or 0 if the key does not exist or the timeout could not be set.
   * @throws {Error} Throws an error if there is an issue setting the expiration, such as a
   *                connection problem with the Redis server or invalid parameters.
   */
  async expire (key, timeInSec) {
    try {
      const result = await this.client.expire(key, timeInSec);
      return result;
    } catch (error) {
      console.error('Error setting expiration:', error.message);
      throw error;
    }
  }

  /**
   * Deletes the specified key from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<number>} A promise that resolves with the number of keys removed (0 or 1).
   */
  async del (key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        return resolve(reply);
      });
    });
  }

  /**
   * Closes the Redis connection.
   */
  quit () {
    this.client.quit();
  }
}

const redisClient = new RedisClient();

export default redisClient;
