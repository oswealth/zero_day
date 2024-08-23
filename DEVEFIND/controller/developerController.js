import Developer from '../modules/developer.js';
import Tools from '../utils/myfunctions.js';
import Authentification from '../controller/authController.js';
import mongoose from 'mongoose';
import redisClient from '../utils/redis.js';
import sharp from 'sharp';

class DeveloperController {
  static async create (req, res) {
    try {
      const { firstName, lastName, email, password, confirmPassword, age, gender, country, profession } = req.body;

      /* ======= checks ========== */
      if (!firstName || !lastName || !email || !password || !confirmPassword || !age || !gender || !country || !profession) {
        return res.status(400).json({ error: 'All Fields Must Be Filed' });
      }
      if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords Do Not Match' });

      const user = await Developer.findOne({ email });
      if (user) return res.status(400).json({ error: 'email already exist' });
      /* ======= End of checks ========== */

      const hashedPwd = await Tools.hashPwd(password);
      const newDevData = { firstName, lastName, email, password: hashedPwd, age, gender, country, profession };
      const developer = await Developer.create(newDevData);
      console.log('Developer Account Created Successfully with the Id => ' + developer._id.toString());
      res.status(201).json({ message: 'Developer Account Created Successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async del (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken, 'dev');
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid ID format' });

      const result = await Developer.findByIdAndDelete(userId);

      if (!result) return res.status(404).send({ error: 'Developer Not Found' });

      redisClient.client.del(`dev_Auth-${authToken}`);
      return res.status(200).json({ message: 'Developer successfully deleted.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async get (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken, 'dev');
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid ID format' });

      const user = await Developer.findById(userId);

      if (!user) return res.status(404).send({ error: 'Developer Not Found' });
      return res.status(200).json({ Developer: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const user = await Developer.find({});
      return res.status(200).json({ Developers: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken, 'dev');

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid ID format' });

      const { firstName, lastName, age, gender, country, backupEmail, phone, profession, languages, level, password, confirmPassword, summary } = req.body;
      const newDevData = {};

      if (password) {
        if (!confirmPassword) return res.status(400).json({ error: 'Confirmation Password is Required' });
        if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords Do Not Match' });

        const hashedPwd = await Tools.hashPwd(password);
        newDevData.password = hashedPwd;
      }

      if (!firstName || !lastName || !age || !gender || !country || !profession || !languages || !level) {
        return res.status(400).json({ error: 'Mandatory fields must be filed' });
      }
      if (age < 18 || age > 65) return res.status(400).json({ error: 'Invalid age it must be between 18 and 65' });

      newDevData.firstName = firstName;
      newDevData.lastName = lastName;
      newDevData.age = age;
      newDevData.gender = gender;
      newDevData.country = country;
      newDevData.profession = profession;
      newDevData.backupEmail = backupEmail;
      newDevData.phone = phone;
      newDevData.languages = languages; // list of {language and proficiency} objects
      newDevData.level = level;
      newDevData.summary = summary; // One Singe object that contains headline and description

      const result = await Developer.findByIdAndUpdate((userId, newDevData, { new: true }));

      if (!result) return res.status(404).json({ error: 'Developer Not Found' });
      else res.status(200).json({ message: 'Developer successfully updated.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateDevImage (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken, 'dev');
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      if (!req.file.mimetype.includes('image')) return res.status(400).json({ error: 'File Uploaded Is Not An Image' });
      if (req.file.size > 1048576) return res.status(400).json({ error: 'File Uploaded Exceeds 1MB' });

      const webpBuffer = await sharp(req.file.buffer).webp({ quality: 80 }).toBuffer();

      const base64Image = webpBuffer.toString('base64');
      const dataUri = `data:image/webp;base64,${base64Image}`;
      const result = await Developer.findByIdAndUpdate(userId, { image: dataUri });

      if (!result) return res.status(401).json({ error: 'Developer Not Found' });
      res.status(200).json({ message: 'Profile Picture Updated Successfully!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeImage (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken, 'dev');
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await Developer.findByIdAndUpdate(userId, { image: '/root/DEVEFIND/static/user.png' });
      if (!result) return res.status(401).json({ error: 'Developer Not Found' });

      res.status(200).json({ message: 'Profile Picture Removed Successfully!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eduInfo (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken, 'dev');

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid ID format' });

      const { education } = req.body;

      const result = await Developer.findByIdAndUpdate(userId, {education}, { new: true });

      if (!result) return res.status(404).json({ error: 'Developer Not Found' });
      else res.status(200).json({ message: 'Developer education info updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async expInfo (req, res) {
    try {
      const authToken = req.header('X-Token');
      const userId = await Authentification.valideLogin(authToken, 'dev');

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid ID format' });

      const { experience } = req.body;

      const result = await Developer.findByIdAndUpdate(userId, {experience}, { new: true });

      if (!result) return res.status(404).json({ error: 'Developer Not Found' });
      else res.status(200).json({ message: 'Developer experience info updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default DeveloperController;
