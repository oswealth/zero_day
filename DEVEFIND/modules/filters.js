import mongoose from 'mongoose';

// Define the schema
const filtersSchema = new mongoose.Schema({
  version: { type: String, required: true },
  country: { type: [String], required: true },
  gender: { type: [String], required: true },
  languages: { type: [String], required: true },
  proficiency: { type: [String], required: true },
  level: { type: [String], required: true },
  profession: { type: [String], required: true }
});

// Create and export the model
const Filters = mongoose.model('Filters', filtersSchema);

export default Filters;
