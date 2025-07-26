const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'User not found' });
      const isMatch = await bcrypt.compare(password, user.password);
      return done(null, isMatch ? user : false, { message: 'Password incorrect' });
    } catch (err) {
      return done(err);
    }
  }));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));
};