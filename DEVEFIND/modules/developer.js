import mongoose from 'mongoose';

const DeveloperSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    lowercase: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    lowercase: true
  },
  age: {
    type: Number,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  profession: {
    type: String,
    required: false
  },
  level: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
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
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  languages: [{
    language: { type: String },
    proficiency: { type: String }
  }],
  image: {
    type: String,
    default: './images/png/user.png'
  },
  summary: {
    headline: { type: String, maxlength: 100, default: '' },
    description: { type: String, maxlength: 700, default: '' }
  },
  education: [{
    institution: { type: String, maxlength: 100 },
    degree: { type: String, maxlength: 100 },
    fieldOfStudy: { type: String, maxlength: 100 },
    graduationDate: { type: Date }
  }],
  experience: [{
    jobTitle: { type: String, maxlength: 100 },
    companyName: { type: String, maxlength: 100 },
    location: { type: String, maxlength: 100 },
    startDate: { type: Date },
    endDate: { type: Date },
    responsibilities: [{ type: String, maxlength: 500 }]
  }],
  portfolio: [{
    projectName: { type: String, maxlength: 100 },
    technologiesUsed: [{ type: String }],
    role: { type: String, maxlength: 250 },
    description: { type: String, maxlength: 500 },
    link: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  }],
  links: {
    gitHub: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/github\.com\/[^\s$.?#].[^\s]*)$/.test(v);
        },
        message: props => `${props.value} is not a valid GitHub URL!`
      }
    },
    linkedin: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/www\.linkedin\.com\/in\/[^\s$.?#].[^\s]*)$/.test(v);
        },
        message: props => `${props.value} is not a valid LinkedIn URL!`
      }
    },
    facebook: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/www\.facebook\.com\/[^\s$.?#].[^\s]*)$/.test(v);
        },
        message: props => `${props.value} is not a valid Facebook URL!`
      }
    },
    blog: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(v);
        },
        message: props => `${props.value} is not a valid blog URL!`
      }
    },
    personalWebsite: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(v);
        },
        message: props => `${props.value} is not a valid personal website URL!`
      }
    }
  },
  certifications: [{
    name: { type: String, maxlength: 100 },
    issuingOrganization: { type: String, maxlength: 100 },
    dateIssued: { type: Date }
  }]
},
{
  timestamps: true
});

const Developer = mongoose.model('Developer', DeveloperSchema);

export default Developer;
