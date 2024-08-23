import mongoose from 'mongoose';

// Define the schema for the User
const RecruiterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    minlength: 3,
    lowercase: true
  },
  lastName: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    minlength: 3,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  backupEmail: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\+\d{9,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  image: {
    type: String,
    required: false,
    default: './images/png/user.png'
  }
}, {
  timestamps: true
});

const Recruiter = mongoose.model('Recruiter', RecruiterSchema);

export default Recruiter;
