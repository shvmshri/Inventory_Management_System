const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const User = require('../models/User');

exports.login = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json(user);
    });
  })(req, res, next);
};

exports.logout = function (req, res) {
  req.logout();
  return res.json({ message: 'Logged out successfully' });
};

exports.register = async function (req, res, next) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};
