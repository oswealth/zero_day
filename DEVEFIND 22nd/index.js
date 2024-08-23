import Database from './utils/db.js';
import express from 'express';
import RecruiterRoutes from './routes/recruiterRouts.js';
import DeveloperRoutes from './routes/developerRouts.js';
import FilterController from './controller/filtersController.js';
import dotenv from 'dotenv';
import redisClient from './utils/redis.js';
import cors from 'cors';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'devefind_frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'devefind_frontend', 'landingpage.html'));
});


app.use('/', RecruiterRoutes);
app.use('/', DeveloperRoutes);
app.get('/stats', Database.stats);
app.get('/api/filters', FilterController.get);

function main () {
  //! Connect to the database
  Database.connect()
    .then(async () => {
      //! Connect to Redis Server
      await redisClient.client.connect();
      /* check if filters Exist */
      await FilterController.setUpFilters();
      /* Run Express Server */
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error(err.message);
      process.exit(1);
    });
}

main();
