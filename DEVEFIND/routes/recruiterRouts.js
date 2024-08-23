import express from 'express';
import RecruiterController from '../controller/recruiterController.js';
import Authentification from '../controller/authController.js';
import multer from 'multer';

const upload = multer();
const RecruiterRoutes = express.Router();

RecruiterRoutes.post('/recruiter/signup', RecruiterController.create); //! Sign Up
RecruiterRoutes.post('/recruiter/login', Authentification.loginRecruiter); /* Sign in */
RecruiterRoutes.post('/recruiter/logout', Authentification.logoutRecruiter); //! Sign out

RecruiterRoutes.get('/api/recruiter', RecruiterController.get);

RecruiterRoutes.delete('/api/recruiter', RecruiterController.del);

RecruiterRoutes.put('/api/recruiter', RecruiterController.update);
RecruiterRoutes.put('/api/recruiter/image/update', upload.single('file'), RecruiterController.updateRecImage);
RecruiterRoutes.put('/api/recruiter/image/remove', RecruiterController.removeImage);

export default RecruiterRoutes;
