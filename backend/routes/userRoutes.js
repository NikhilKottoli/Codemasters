const express = require('express');

const {
  serveSigninPage,
  serveSignupPage,
  handleSignin,
  handleSignup,
  handleLogout,
  getUserData,
} = require('../controllers/userController');

const router = express.Router();

// Define routes and associate them with controller functions
router.get('/signin', serveSigninPage);
router.get('/signup', serveSignupPage);
router.post('/signin', handleSignin);
router.post('/signup', handleSignup);
router.get('/logout', handleLogout);
router.get('/userData', getUserData);

module.exports = router;  // Export the router to be used elsewhere
