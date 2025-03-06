// Route: userRoutes.js

const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('/profile', authMiddleware, userController.getUserProfile);
router.post('/action', authMiddleware, userController.submitAction);
router.get('/actions', userController.getActions);
router.post('/role', userController.createRole);
router.get('/roles', userController.getRoles);
router.put('/role/:id', userController.updateRole);
router.delete('/role/:id', userController.deleteRole);
router.delete('/action/:id', userController.deleteAction);

module.exports = router;
