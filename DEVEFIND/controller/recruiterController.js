import Recruiter from '../modules/recruiter.js';
import Tools from '../utils/myfunctions.js';
import Authentification from '../controller/authController.js';
import mongoose from 'mongoose';
import sharp from 'sharp';
import redisClient from '../utils/redis.js';

class RecruiterController {
  static async create (req, res) {
    try {
      const { firstName, lastName, email, password, confirmPassword } = req.body;

      /* ======= checks ========== */
      if (!firstName || !lastName || !email || !password || !confirmPassword) return res.status(400).json({ error: 'All Fields Must Be Filed' });
      const user = await Recruiter.findOne({ email });
      if (user) return res.status(400).json({ error: 'email already exist' });
      if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords Do Not Match' });

      /* ======= End of checks ========== */

      const hashedPwd = await Tools.hashPwd(password);
      const newRecruiterData = { firstName, lastName, email, password: hashedPwd };

      const recruiter = await Recruiter.create(newRecruiterData);
      console.log('Recruiter Account Created Successfully with the Id => ' + recruiter._id.toString());
      res.status(201).json({ message: 'Recruiter Account Created Successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async get (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid ID format' });

      const user = await Recruiter.findById(userId);

      if (!user) return res.status(404).send({ error: 'Recruiter Not Found' });
      return res.status(200).json({ recruiter: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async del (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid ID format' });

      const result = await Recruiter.findByIdAndDelete(userId);

      if (!result) return res.status(404).send({ error: 'Recruiter Not Found' });

      redisClient.client.del(`recruiter_Auth-${authToken}`);
      return res.status(200).json({ message: 'Recruiter successfully deleted.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken);

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid ID format' });

      const { firstName, lastName, password, confirmPassword, backupEmail, phone } = req.body;
      let newRecruiterData = {};

      if (!firstName || !lastName) { return res.status(400).json({ error: 'Mandatory fields must be filed' }); }

      if (password) {
        if (!confirmPassword) return res.status(400).json({ error: 'Confirmation Password is Required' });
        if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords Do Not Match' });

        const hashedPwd = await Tools.hashPwd(password);
        newRecruiterData = { ...newRecruiterData, password: hashedPwd };
      }
      newRecruiterData = { ...newRecruiterData, firstName, lastName, backupEmail, phone };

      const result = await Recruiter.findByIdAndUpdate(userId, newRecruiterData);

      if (!result) return res.status(404).json({ error: 'Recruiter Not Found' });
      else res.status(200).json({ message: 'Recruiter successfully updated.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateRecImage (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      if (!req.file.mimetype.includes('image')) return res.status(400).json({ error: 'File Uploaded Is Not An Image' });
      if (req.file.size > 1048576) return res.status(400).json({ error: 'File Uploaded Exceeds 1MB' });

      const webpBuffer = await sharp(req.file.buffer).webp({ quality: 80 }).toBuffer();

      const base64Image = webpBuffer.toString('base64');
      const dataUri = `data:image/webp;base64,${base64Image}`;

      const result = await Recruiter.findByIdAndUpdate(userId, { image: dataUri });
      if (!result) return res.status(401).json({ error: 'Recruiter Not Found' });

      res.status(200).json({ message: 'Profile Picture Updated Successfully!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeImage (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await Recruiter.findByIdAndUpdate(userId, { image: '/root/DEVEFIND/static/user.png' });
      if (!result) return res.status(401).json({ error: 'Recruiter Not Found' });

      res.status(200).json({ message: 'Profile Picture Removed Successfully!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default RecruiterController;
