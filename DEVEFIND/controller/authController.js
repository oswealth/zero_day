import Recruiter from '../modules/recruiter.js';
import redisClient from '../utils/redis.js';
import Tools from '../utils/myfunctions.js';
import mongoose from 'mongoose';
import Developer from '../modules/developer.js';

class Authentification {
  static async loginRecruiter (req, res) {
    try {
      const { email, password } = req.body;
      /* ======= checks ========== */
      if (!email || !password) return res.status(400).json({ error: 'All Fields Must Be Filed' });

      const user = await Recruiter.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Account Does Not Exist' });

      const result = await Tools.authenticatePassword(password, user.password);
      if (!result) return res.status(401).json({ error: 'Incorrect Password' });
      /* ======= End Of checks ========== */

      const token = Tools.generateToken();
      const key = `recruiter_Auth-${token}`;
      const value = user.id;
      const timeInSec = 60 * 60 * 6; //! Authentification expires after 6 Hours

      const reply = await redisClient.client.set(key, value);
      if (reply !== 'OK') return res.status(500).json({ error: 'Rrdis Server Error' });
      console.log(`Log in Success, Token: ${token}`);
      const expirationResult = await redisClient.client.expire(key, timeInSec);
      if (expirationResult) {
        console.log(`The key will expire in ${timeInSec} seconds from now.`);
      }

      res.status(200).json({ status: 'connected', token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async valideLogin (authToken, userType = 'rec') {
    const key = (userType === 'dev') ? 'dev_Auth' : 'recruiter_Auth';
    if (!authToken) return false;
    const userId = redisClient.client.get(`${key}-${authToken}`);
    if (!userId) return false;

    return userId;
  }

  static async logoutRecruiter (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken);

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid ID format' });

      redisClient.client.del(`recruiter_Auth-${authToken}`);
      return res.status(200).json({ message: 'Recruiter Successfully Loged Out.', status: 'disconnected' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async loginDeveloper (req, res) {
    try {
      const { email, password } = req.body;
      /* ======= checks ========== */
      if (!email || !password) return res.status(400).json({ error: 'All Fields Must Be Filed' });

      const user = await Developer.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Account Does Not Exist' });

      const result = await Tools.authenticatePassword(password, user.password);
      if (!result) return res.status(401).json({ error: 'Incorrect Password' });
      /* ======= End Of checks ========== */

      const token = Tools.generateToken();
      const key = `dev_Auth-${token}`;
      const value = user.id;
      const timeInSec = 60 * 60 * 6; //! Authentification expires after 6 Hours

      const reply = await redisClient.client.set(key, value);
      if (reply !== 'OK') return res.status(500).json({ error: 'Rrdis Server Error' });
      console.log(`Log in Success, Token: ${token}`);

      const expirationResult = await redisClient.client.expire(key, timeInSec);
      if (expirationResult) {
        console.log(`The key will expire in ${timeInSec} seconds from now.`);
      }

      res.status(200).json({ status: 'connected', token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async logoutDeveloper (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken, 'dev');

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid ID format' });

      redisClient.client.del(`dev_Auth-${authToken}`);
      return res.status(200).json({ message: 'Developer Successfully Loged Out.', status: 'disconnected' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default Authentification;
