import express from 'express';
import DeveloperController from '../controller/developerController.js';
import Authentification from '../controller/authController.js';
import multer from 'multer';

const upload = multer();

const DeveloperRoutes = express.Router();

DeveloperRoutes.post('/developer/signup', DeveloperController.create); //! Sign Up
DeveloperRoutes.post('/developer/login', Authentification.loginDeveloper); /* Sign in */
DeveloperRoutes.post('/developer/logout', Authentification.logoutDeveloper); //! Sign out

DeveloperRoutes.get('/api/developer', DeveloperController.get);
DeveloperRoutes.get('/api/developer/all', DeveloperController.getAll);

DeveloperRoutes.delete('/api/developer', DeveloperController.del); //! Delete

//DeveloperRoutes.put('/api/developer/personal/info', DeveloperController.addPersonalInfo); // ? To add personal information (mandatory)
DeveloperRoutes.put('/api/developer/update/personal', DeveloperController.update); // ? To Update personal information

DeveloperRoutes.put('/api/developer/edu', DeveloperController.eduInfo);
DeveloperRoutes.put('/api/developer/exp', DeveloperController.expInfo);

// `upload.single('file')` parses the file data and attaches it to `req.file`
DeveloperRoutes.put('/api/developer/image/update', upload.single('file'), DeveloperController.updateDevImage);
DeveloperRoutes.put('/api/developer/image/remove', DeveloperController.removeImage);

export default DeveloperRoutes;
