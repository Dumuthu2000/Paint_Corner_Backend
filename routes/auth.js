const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

//Sign up 
router.post('/signup', authController.signup);
//Sign In user with role base
router.post('/signin', authController.signin);

module.exports = router;