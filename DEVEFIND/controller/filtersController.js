import fs from 'fs/promises';
import Filters from '../modules/filters.js';
import dotenv from 'dotenv';

dotenv.config();

const JSONfile = process.env.FILTERSFILE;
const JSONfileBackup = process.env.FILTERS_FILE_BACKUP;
const version = '1.0';

class FilterController {
  static async setUpFilters () {
    try {
      // Check if filters exist for the given version
      const filters = await Filters.find({ version });
      if (filters.length > 0) {
        console.log('All Filters Exist :)');
        return;
      }

      console.error('Filters not found.');
      console.log('Fixing Filters...');

      // Read the JSON file
      const data = await fs.readFile(JSONfile, 'utf8');
      const jsonData = JSON.parse(data);

      if (Object.keys(jsonData).length === 0) {
        throw new Error('File Is Empty');
      }

      // Insert the data into the database
      const updateFilter = await Filters.insertMany(jsonData);
      if (updateFilter) {
        console.log('Filters Fixed Successfully');
      } else {
        console.error('Failed to insert filters.');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }

  static async get (req, res) {
    try {
      const filters = await Filters.find({ version });
      if (!filters || filters.length === 0) {
        const backupFilters = await fs.readFile(JSONfileBackup, 'utf-8');
        console.log(backupFilters);
        if (!backupFilters) {
          return res.status(404).json({ filters: 'Not Found' });
        }
        res.status(200).json(JSON.parse(backupFilters));
      }
      res.status(200).json(filters[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default FilterController;
