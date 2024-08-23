import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const saltRounds = 10; // Number of salt rounds for bcrypt

class Tools {
  static async hashPwd (pwd) {
    try {
      const hashedPassword = await bcrypt.hash(pwd, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw error;
    }
  }

  static async authenticatePassword (plainPassword, hashedPassword) {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  }

  static generateToken () {
    const token = uuidv4();
    return token;
  }
}

export default Tools;
