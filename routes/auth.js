const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// GET register
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// POST register
router.post('/register', async (req, res) => {
  const { email, password, password2 } = req.body;

  if (!email || !password || !password2) {
    req.flash('error_msg', 'Please fill in all fields');
    return res.redirect('/register');
  }

  if (password !== password2) {
    req.flash('error_msg', 'Passwords do not match');
    return res.redirect('/register');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    req.flash('error_msg', 'Email is already registered');
    return res.redirect('/register');
  }

  const user = new User({ email, password });
  await user.save();
  req.flash('success_msg', 'You are now registered and can log in');
  res.redirect('/login');
});

// GET login
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// POST login
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/recipes',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

// GET logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});

module.exports = router;
