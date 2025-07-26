const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.showLogin = (req, res) => {
  res.render('auth/login');
};

exports.showRegister = (req, res) => {
  res.render('auth/register');
};

exports.register = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({ username: req.body.username, password: hashed });
    await user.save();
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/recipes');
  } catch (err) {
    res.render('auth/register', { error: 'Registration failed. Username may already exist.' });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.userId = user._id;
      req.session.username = user.username;
      res.redirect('/recipes');
    } else {
      res.render('auth/login', { error: 'Login failed. Check your credentials.' });
    }
  } catch (err) {
    res.render('auth/login', { error: 'Login failed. Try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
};
