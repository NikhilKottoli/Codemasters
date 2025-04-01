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

router.get('/signin', serveSigninPage);
router.get('/signup', serveSignupPage);
router.post('/signin', handleSignin);
router.post('/signup', handleSignup);
router.get('/logout', handleLogout);
router.get('/userData/:id', getUserData);

module.exports = router;
